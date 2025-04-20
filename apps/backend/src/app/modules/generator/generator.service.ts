import fs from "node:fs";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import archiver from "archiver";
import { commonPackages, expressPackages, fastifyPackages } from "../../constants/packages";
// biome-ignore lint/style/useImportType: <explanation>
import { MetadataDTO } from "./dtos/metadata.dto";
// biome-ignore lint/style/useImportType: <explanation>
import {
	BaseGenerator,
	ExtraService,
	MainUpdaterService,
	ModuleService,
	PackageJsonService,
	SwaggerService
} from "./generators";
import {
	appControllerTemplate,
	appModuleTemplate,
	appServiceTemplate,
	mainTemplate,
	nestjsCli,
	readmeTemplate
} from "./templates";
import { modulesTemplates } from "./templates/rootFiles/modules.template";
import { tsconfig, tsconfigBuild } from "./templates/rootFiles/tsconfig.template";

@Injectable()
export class GeneratorService extends BaseGenerator {
	public constructor(
		private readonly packageJsonGenerator: PackageJsonService,
		private readonly moduleGenerator: ModuleService,
		private readonly mainUpdaterGenerator: MainUpdaterService,
		private readonly swaggerGenerator: SwaggerService,
		private readonly extraGenerator: ExtraService
	) {
		super();
	}

	public async generate(metadata: MetadataDTO): Promise<fs.ReadStream> {
		const id = Date.now().toString();
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

		this.createFile(id, mainTemplate(metadata.mainType));
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

		this.createFile(id, appModuleTemplate);
		this.createFile(id, appControllerTemplate);
		this.createFile(id, appServiceTemplate);

		rootDirFiles.push(
			...[
				this.createFile(id, tsconfig),
				this.createFile(id, tsconfigBuild),
				this.createFile(id, nestjsCli),
				this.createFile(id, readmeTemplate)
			]
		);
		const modulesFiles = await this.generateModules(id, metadata.modules, metadata.mainType);
		rootDirFiles.push(...modulesFiles);

		if (metadata.extras.length > 0) {
			const withConfigModule = metadata.modules.includes("config");
			await this.extraGenerator.generate(id, metadata.extras, metadata.mainType, withConfigModule);
		}

		const zipFile = await this.generateZipFile(rootDirFiles, id);

		setTimeout(() => {
			fs.rm(path.join(__dirname, "__generated__", id), { recursive: true }, (err) => {
				if (err) {
					console.error(`Error deleting directory: ${err}`);
				} else {
					console.log(`Directory deleted successfully: ${id}`);
				}
			});
		}, 10_000);

		return zipFile;
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
	private async generateModules(id: string, rawModules: MetadataDTO["modules"], mainType: MetadataDTO["mainType"]) {
		const moduleGeneratedFiles = [];

		const modules = [...rawModules.filter((m) => m !== "swagger"), ...rawModules.filter((m) => m === "swagger")];

		if (modules.length > 0 && !(modules.length === 1 && modules[0] === "swagger")) {
			this.createFile(id, { name: "index.ts", path: "src/modules", content: "" });
		}

		const withConfigModule = modules.includes("config");
		for (const module of modules) {
			if (module === "swagger") {
				await this.swaggerGenerator.generate(id, mainType, withConfigModule);
				continue;
			}
			const moduleFiles = modulesTemplates.find((m) => m.name === module);
			const moduleRootFiles = await this.moduleGenerator.generate(
				id,
				moduleFiles.templates,
				{
					export: moduleFiles.constants.exporter,
					import: moduleFiles.constants.name,
					importIn: "src/app.module.ts"
				},
				mainType
			);
			moduleGeneratedFiles.push(...moduleRootFiles);
			if (moduleFiles.constants.serviceConstant) {
				this.moduleGenerator.updateServiceConstants(id, moduleFiles.constants.serviceConstant);
			}

			if (moduleFiles.packages) {
				for (const packageMeta of moduleFiles.packages) {
					await this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
				}
			}

			if (moduleFiles.mainTemplates) {
				const templates = moduleFiles.mainTemplates(mainType);
				for (const template of templates) {
					this.mainUpdaterGenerator.update(id, template);
				}
			}
		}

		return moduleGeneratedFiles;
	}

	private async generateZipFile(
		files: {
			fileName: string;
			stream: fs.ReadStream;
		}[],
		id: string
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

		await new Promise((resolve, reject) => {
			output.on("close", resolve);
			output.on("error", reject);
			archive.finalize();
		});

		return fs.createReadStream(zipPath);
	}
}
