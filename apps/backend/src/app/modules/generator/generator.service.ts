import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { Injectable, Logger } from "@nestjs/common";
import archiver from "archiver";
import { commonPackages, expressPackages, fastifyPackages } from "../../constants/packages";
// biome-ignore lint/style/useImportType: <explanation>
import { MetadataDTO } from "./dtos/metadata.dto";
// biome-ignore lint/style/useImportType: <explanation>
import {
	BaseGenerator,
	DockerService,
	ExtraService,
	FileUpdaterService,
	LinterFormatterService,
	ModuleService,
	PackageJsonService,
	SwaggerService,
	TestRunnerService
} from "./generators";
import { AppTemplates } from "./templates/app.templates";
import { modulesTemplates } from "./templates/modules.templates";
import { RootFilesTemplates } from "./templates/root-files-templates";

@Injectable()
export class GeneratorService extends BaseGenerator {
	public constructor(
		private readonly packageJsonGenerator: PackageJsonService,
		private readonly moduleGenerator: ModuleService,
		private readonly fileUpdaterGenerator: FileUpdaterService,
		private readonly swaggerGenerator: SwaggerService,
		private readonly extraGenerator: ExtraService,
		private readonly linterFormatterGenerator: LinterFormatterService,
		private readonly dockerGenerator: DockerService,
		private readonly testRunnerGenerator: TestRunnerService
	) {
		super();
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
	public async generate(metadata: MetadataDTO, id: string): Promise<fs.ReadStream> {
		const packageJson = await this.packageJsonGenerator.generate(metadata.packageJson, id);
		const rootDirFiles = [packageJson];

		const packageManagers = {
			npm: "package-lock.json",
			yarn: "yarn.lock",
			pnpm: "pnpm-lock.yaml"
		};
		const lockFile = this.createFile(id, {
			name: packageManagers[metadata.packageManager],
			path: "",
			content: ""
		});
		rootDirFiles.push(lockFile);

		const configFile = await this.generateConfigFile(metadata, id);
		rootDirFiles.push(configFile);

		if (metadata.mainType === "fastify") {
			for (const packageMeta of fastifyPackages) {
				await this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
			}
		}

		if (metadata.mainType === "express") {
			for (const packageMeta of expressPackages) {
				await this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
			}
		}

		for (const packageMeta of commonPackages) {
			await this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
		}

		for (const template of AppTemplates) {
			this.createFile(id, template);
		}

		for (const template of RootFilesTemplates(metadata.mainType)) {
			const file = this.createFile(id, template);
			if (template.name === "main.ts") continue;
			rootDirFiles.push(file);
		}

		const modulesFiles = await this.generateModules(
			id,
			metadata.modules,
			metadata.mainType,
			metadata.packageManager,
			metadata.linterFormatter,
			metadata.packageJson.name
		);
		rootDirFiles.push(...modulesFiles);

		if (metadata.extras.length > 0) {
			const withConfigModule = metadata.modules.includes("config");
			await this.extraGenerator.generate(id, metadata.extras, metadata.mainType, withConfigModule);
		}

		if (metadata.linterFormatter) {
			const linterFormatterFiles = await this.linterFormatterGenerator.generate(id, metadata.linterFormatter);
			rootDirFiles.push(...linterFormatterFiles);
		}

		if (metadata.docker) {
			const dockerFiles = await this.dockerGenerator.generate(
				id,
				metadata.packageManager,
				metadata.packageJson.nodeVersion,
				metadata.packageJson.name
			);
			rootDirFiles.push(...dockerFiles);
		}

		if (metadata.testRunner) {
			const testRunnerFiles = await this.testRunnerGenerator.generate(id, metadata.testRunner);
			rootDirFiles.push(...testRunnerFiles);
		}

		await this.lintAndFormat(id);

		const extraFolders = [];

		if (metadata.modules.includes("husky")) {
			extraFolders.push(".husky");
		}

		const zipFile = await this.generateZipFile(rootDirFiles, id, extraFolders);

		setTimeout(() => {
			fs.rm(path.join(__dirname, "__generated__", id), { recursive: true }, (err) => {
				if (err) {
					Logger.error(`Error deleting directory: ${err}`, `Delete:${id}`);
				} else {
					Logger.log("Directory deleted successfully", `Delete:${id}`);
				}
			});
		}, 10_000);

		return zipFile;
	}

	public async generateConfigFile(metadata: MetadataDTO, id: string) {
		const configFile = this.createFile(id, {
			name: "nestjs-initializr.json",
			path: "",
			content: JSON.stringify(metadata, null, 2)
		});

		return configFile;
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
	private async generateModules(
		id: string,
		rawModules: MetadataDTO["modules"],
		mainType: MetadataDTO["mainType"],
		packageManager: MetadataDTO["packageManager"],
		linterFormatter: MetadataDTO["linterFormatter"],
		projectName: string
	) {
		const moduleGeneratedFiles = [];

		const modules = [
			...rawModules.filter((m) => m === "config"),
			...rawModules.filter((m) => m !== "config" && m !== "swagger"),
			...rawModules.filter((m) => m === "swagger")
		];

		if (modules.length > 0 && !(modules.length === 1 && modules[0] === "swagger")) {
			this.createFile(id, { name: "index.ts", path: "src/modules", content: "" });
		}

		const withConfigModule = modules.includes("config");
		const withI18nModule = modules.includes("i18n");
		for (const module of modules) {
			if (module === "swagger") {
				await this.swaggerGenerator.generate(id, mainType, withConfigModule, withI18nModule, projectName);
				continue;
			}
			const moduleFiles = modulesTemplates(withConfigModule, mainType, packageManager, linterFormatter).find(
				(m) => m.name === module
			);
			const moduleRootFiles = await this.moduleGenerator.generate(
				id,
				moduleFiles.templates,
				{
					export: moduleFiles.constants.export,
					import: moduleFiles.constants.import,
					importIn: moduleFiles.constants.importIn,
					importArray: moduleFiles.constants.importArray
				},
				mainType
			);
			moduleGeneratedFiles.push(...moduleRootFiles);
			if (moduleFiles.constants.token) {
				this.moduleGenerator.updateServiceConstants(id, moduleFiles.constants.token);
			}

			if (moduleFiles.packages) {
				for (const packageMeta of moduleFiles.packages) {
					await this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
				}
			}

			if (moduleFiles.scripts) {
				for (const script of moduleFiles.scripts) {
					await this.packageJsonGenerator.addScript(id, script.name, script.command);
				}
			}

			if (moduleFiles.filesToUpdate) {
				for (const file of moduleFiles.filesToUpdate) {
					for (const template of file.templates) {
						const fileCreated = await this.fileUpdaterGenerator.update(id, file.path, file.name, template);
						if (fileCreated) {
							moduleGeneratedFiles.push(fileCreated);
						}
					}
				}
			}

			if (moduleFiles.mainTemplates) {
				for (const template of moduleFiles.mainTemplates) {
					this.fileUpdaterGenerator.update(id, "src", "main.ts", template);
				}
			}
		}

		return moduleGeneratedFiles;
	}

	private async lintAndFormat(id: string): Promise<void> {
		const dirPath = this.getPath(id);
		const configPath = path.join(__dirname, "assets");

		const packageJsonPath = path.join(dirPath, "package.json");
		const rawPackageJson = this.readFile(packageJsonPath);
		const packageJson = JSON.parse(rawPackageJson);

		function sortObject(obj: Record<string, string>) {
			return Object.keys(obj)
				.sort((a, b) => a.localeCompare(b))
				.reduce(
					(acc, key) => {
						acc[key] = obj[key];
						return acc;
					},
					{} as Record<string, string>
				);
		}

		packageJson.dependencies = sortObject(packageJson.dependencies);
		packageJson.devDependencies = sortObject(packageJson.devDependencies);

		this.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

		async function runBiomeCommand(args: string[]): Promise<void> {
			return new Promise((resolve, reject) => {
				const process = spawn("biome", [...args, "--config-path", configPath, dirPath]);

				process.stdout?.on("data", (data) => {
					Logger.log(`[biome ${args[0]} stdout]: ${data.toString().trim()}`, `Biome:${args[0]}:${id}`);
				});

				process.stderr?.on("data", (data) => {
					Logger.error(`[biome ${args[0]} stderr]: ${data.toString().trim()}`, `Biome:${args[0]}:${id}`);
				});

				process.on("error", (err) => {
					reject(new Error(`Biome execute error ${args[0]}: ${err.message}`));
				});

				process.on("close", (code) => {
					if (code === 0) {
						resolve();
					} else {
						reject(new Error(`Biome ${args[0]} exit code: ${code}`));
					}
				});
			});
		}

		await runBiomeCommand(["lint", "--write"]);
		await runBiomeCommand(["format", "--write"]);
	}

	private async generateZipFile(
		files: {
			fileName: string;
			stream: fs.ReadStream;
		}[],
		id: string,
		extraFolders: string[]
	): Promise<fs.ReadStream> {
		const dirPath = path.join(__dirname, "__generated__", id);
		const srcPath = path.join(dirPath, "src");
		const zipPath = path.join(dirPath, "project.zip");

		this.mkdir(dirPath);

		const output = fs.createWriteStream(zipPath);
		const archive = archiver("zip", {
			zlib: { level: 9 }
		});

		archive.pipe(output);

		for (const file of files) {
			archive.append(file.stream, { name: file.fileName });
		}

		archive.directory(srcPath, "src");

		if (extraFolders) {
			for (const folder of extraFolders) {
				archive.directory(path.join(dirPath, folder), folder);
			}
		}

		await new Promise((resolve, reject) => {
			output.on("close", resolve);
			output.on("error", reject);
			archive.finalize();
		});

		return fs.createReadStream(zipPath);
	}
}
