import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { Injectable, Logger } from "@nestjs/common";
import archiver from "archiver";
import { createContext, type GeneratedFile, type PackageDependency, type Script } from "@/app/common";
import { commonPackages, expressPackages, fastifyPackages } from "@/app/constants/packages";
// biome-ignore lint/style/useImportType: Cannot use 'import type' in Dependency Injection
import { PluginExecutor } from "./core";
import type { MetadataDTO } from "./dtos/metadata.dto";

/**
 * Main generator service using the plugin system
 *
 * Plugins are auto-registered via @Plugin decorator
 * The plugins to execute are determined by metadata.modules from the frontend
 */
@Injectable()
export class PluginGeneratorService {
	private readonly logger = new Logger(PluginGeneratorService.name);

	public constructor(private readonly executor: PluginExecutor) {}

	/**
	 * Generate a project based on user's metadata
	 *
	 * @param metadata - Contains user selections from frontend (modules, extras, etc.)
	 * @param id - Unique generation ID
	 */
	public async generate(metadata: MetadataDTO, id: string, debugCleanup = false): Promise<fs.ReadStream | string> {
		const ctx = createContext(id, metadata);

		const selectedModules = metadata.modules ?? [];
		this.logger.log(`Generating project with modules: ${selectedModules.join(", ") || "none"}`);

		if (selectedModules.length > 0) {
			fs.mkdirSync("src/modules", { recursive: true });
			fs.writeFileSync("src/modules/index.ts", "");
			ctx.files.set("src/modules/index.ts", { path: "src/modules", name: "index.ts", content: "" });
		}

		const result = await this.executor.execute(ctx, selectedModules);

		if (!result.success) {
			this.logger.error("Generation errors:", result.errors);
			throw new Error(`Generation failed: ${result.errors.join(", ")}`);
		}

		for (const file of result.files) {
			file.content = file.content.replace("//MoreOptions?", "").replace("//MoreOptions_", "");
		}

		const envFile = result.files.find((file) => file.name === ".env");
		if (envFile) {
			result.files.push({ name: ".envexample", path: "", content: envFile.content });
		}

		const basePath = this.getPath(id);
		await this.writeFilesToDisk(basePath, result.files);

		await this.generatePackageJson(basePath, metadata, result.packages, result.scripts);

		if (!debugCleanup) await this.lintAndFormat(id);

		this.scheduleCleanup(id, debugCleanup);

		if (debugCleanup) return basePath;

		const zipStream = await this.createZipFile(basePath, result.files, result.rootFolders, metadata.packageManager);

		return zipStream;
	}

	private async writeFilesToDisk(basePath: string, files: GeneratedFile[]): Promise<void> {
		fs.mkdirSync(basePath, { recursive: true });

		for (const file of files) {
			const dirPath = path.join(basePath, file.path);
			const filePath = path.join(dirPath, file.name);

			fs.mkdirSync(dirPath, { recursive: true });
			fs.writeFileSync(filePath, file.content, "utf-8");
		}
	}

	private getLockfileName(packageManager: string): string | null {
		switch (packageManager) {
			case "npm":
				return "package-lock.json";
			case "yarn":
				return "yarn.lock";
			case "pnpm":
				return "pnpm-lock.yaml";
			default:
				return null;
		}
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This method is responsible for generating the package.json file based on the metadata and selected packages. It needs to handle multiple sources of dependencies (common, platform-specific, and extra) and scripts, which adds to its complexity.
	private async generatePackageJson(
		basePath: string,
		metadata: MetadataDTO,
		packages: PackageDependency[],
		scripts: Script[]
	): Promise<void> {
		const packageJson: Record<string, unknown> = {
			name: metadata.packageJson.name,
			version: "1.0.0",
			description: metadata.packageJson.description ?? "",
			private: true,
			packageManager: this.resolvePackageManager(metadata.packageManager),
			scripts: {} as Record<string, string>,
			dependencies: {} as Record<string, string>,
			devDependencies: {} as Record<string, string>,
			engines: {
				node: `>=${metadata.packageJson.nodeVersion}`
			}
		};

		for (const pkg of commonPackages) {
			const target = pkg.dev ? "devDependencies" : "dependencies";
			(packageJson[target] as Record<string, string>)[pkg.name] = pkg.version;
		}

		const platformPackages = metadata.mainType === "fastify" ? fastifyPackages : expressPackages;
		for (const pkg of platformPackages) {
			const target = pkg.dev ? "devDependencies" : "dependencies";
			(packageJson[target] as Record<string, string>)[pkg.name] = pkg.version;
		}

		for (const pkg of packages) {
			const target = pkg.dev ? "devDependencies" : "dependencies";
			(packageJson[target] as Record<string, string>)[pkg.name] = pkg.version;
		}

		if (metadata.extraPackages) {
			for (const pkg of metadata.extraPackages) {
				const target = pkg.dev ? "devDependencies" : "dependencies";
				(packageJson[target] as Record<string, string>)[pkg.name] = pkg.version;
			}
		}

		for (const script of scripts) {
			(packageJson.scripts as Record<string, string>)[script.name] = script.command;
		}
		packageJson.dependencies = this.sortObject(packageJson.dependencies as Record<string, string>);
		packageJson.devDependencies = this.sortObject(packageJson.devDependencies as Record<string, string>);

		const lockfileName = this.getLockfileName(metadata.packageManager);
		fs.writeFileSync(path.join(basePath, lockfileName), "", "utf-8");

		const filePath = path.join(basePath, "package.json");
		fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), "utf-8");
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <>
	private async createZipFile(
		basePath: string,
		files: GeneratedFile[],
		rootFolders: string[],
		packageManager: string
	): Promise<fs.ReadStream> {
		const zipPath = path.join(basePath, "project.zip");
		const output = fs.createWriteStream(zipPath);
		const archive = archiver("zip", { zlib: { level: 9 } });

		archive.pipe(output);

		const srcPath = path.join(basePath, "src");
		if (fs.existsSync(srcPath)) {
			archive.directory(srcPath, "src");
		}

		for (const folder of rootFolders) {
			const folderPath = path.join(basePath, folder);
			if (fs.existsSync(folderPath)) {
				archive.directory(folderPath, folder);
			}
		}

		for (const file of files) {
			if (file.path === "") {
				const filePath = path.join(basePath, file.name);
				if (file.name === ".envexample") {
					archive.file(filePath, { name: ".env.example" });
					continue;
				}
				if (fs.existsSync(filePath)) {
					archive.file(filePath, { name: file.name });
				}
			}
		}

		archive.file(path.join(basePath, "package.json"), { name: "package.json" });

		const lockfileName = this.getLockfileName(packageManager);

		if (lockfileName) {
			const lockfilePath = path.join(basePath, lockfileName);

			if (fs.existsSync(lockfilePath)) {
				archive.file(lockfilePath, { name: lockfileName });
			}
		}

		await new Promise<void>((resolve, reject) => {
			output.on("close", resolve);
			output.on("error", reject);
			archive.finalize();
		});

		return fs.createReadStream(zipPath);
	}

	private getPath(id: string, filePath?: string): string {
		return path.join(__dirname, "__generated__", id, filePath ?? "");
	}

	/**
	 * Generate a configuration file that can be used to recreate the project
	 *
	 * @param metadata - Contains user selections from frontend
	 * @param id - Unique generation ID
	 */
	public async generateConfigFile(metadata: MetadataDTO, id: string): Promise<fs.ReadStream> {
		const basePath = this.getPath(id);
		fs.mkdirSync(basePath, { recursive: true });

		const configPath = path.join(basePath, "nestjs-initializer.json");
		fs.writeFileSync(configPath, JSON.stringify(metadata, null, 2), "utf-8");

		this.scheduleCleanup(id);

		return fs.createReadStream(configPath);
	}

	private scheduleCleanup(id: string, debugCleanup = false): void {
		setTimeout(
			() => {
				const dirPath = this.getPath(id);
				fs.rm(dirPath, { recursive: true }, (err) => {
					if (err) {
						this.logger.error(`Error deleting directory: ${err}`, `Delete:${id}`);
						return;
					}

					this.logger.log("Directory deleted successfully", `Delete:${id}`);
				});
			},
			debugCleanup ? 60_000 : 10_000
		);
	}

	private sortObject(obj: Record<string, string>): Record<string, string> {
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

	private async lintAndFormat(id: string): Promise<void> {
		const dirPath = this.getPath(id);
		const configPath = path.join(__dirname, "assets", "biome.config.json");

		const biomeModuleFile = this.getPath(id, "biome.json");
		const biomeTempModuleFile = this.getPath(id, "biome.json.disabled");

		if (fs.existsSync(biomeModuleFile)) fs.renameSync(biomeModuleFile, biomeTempModuleFile);

		const runBiomeCommand = (args: string[]): Promise<void> => {
			return new Promise((resolve, reject) => {
				const process = spawn("biome", [...args, "--config-path", configPath], { cwd: dirPath });

				process.stdout?.on("data", (data) => {
					this.logger.log(`[biome ${args[0]} stdout]: ${data.toString().trim()}`);
				});

				process.stderr?.on("data", (data) => {
					this.logger.error(`[biome ${args[0]} stderr]: ${data.toString().trim()}`);
				});

				process.on("error", (err) => {
					reject(new Error(`Biome execute error ${args[0]}: ${err.message}`));
				});

				process.on("close", (code) => {
					if (code === 0) {
						resolve();
						return;
					}

					reject(new Error(`Biome ${args[0]} exit code: ${code}`));
				});
			});
		};

		await runBiomeCommand(["lint", "--write"]);
		await runBiomeCommand(["format", "--write"]);

		if (fs.existsSync(biomeTempModuleFile)) {
			fs.renameSync(biomeTempModuleFile, biomeModuleFile);
		}
	}

	private resolvePackageManager(packageManager: string): string | undefined {
		const versions: Record<string, string> = {
			pnpm: "pnpm@10.29.1",
			yarn: "yarn@4.9.2",
			npm: "npm@10.9.2"
		};

		return versions[packageManager];
	}
}
