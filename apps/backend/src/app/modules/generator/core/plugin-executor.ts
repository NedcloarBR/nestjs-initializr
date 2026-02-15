import { Injectable, Logger } from "@nestjs/common";
import type {
	FileUpdate,
	GeneratedFile,
	GeneratorContext,
	IGeneratorPlugin,
	PackageDependency,
	PluginResult,
	Script
} from "@/app/common/interfaces";
// biome-ignore lint/style/useImportType: Cannot use 'import type' in Dependency Injection
import { PluginContainer } from "./plugin-container";

export interface ExecutionResult {
	files: GeneratedFile[];
	packages: PackageDependency[];
	scripts: Script[];
	rootFolders: string[];
	success: boolean;
	errors: string[];
}

/**
 * Executes plugins and aggregates their results
 * Similar to NestJS middleware/interceptor execution
 */
@Injectable()
export class PluginExecutor {
	private readonly logger = new Logger(PluginExecutor.name);

	public constructor(private readonly container: PluginContainer) {}

	/**
	 * Execute plugins for the given module names
	 */

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Function is complex but well-structured for its purpose
	public async execute(ctx: GeneratorContext, moduleNames: string[]): Promise<ExecutionResult> {
		const errors: string[] = [];
		const allResults: PluginResult[] = [];
		const startTime = Date.now();

		this.logger.log(`🚀 Starting generation for project "${ctx.metadata.packageJson.name}"`);
		this.logger.debug(`Selected modules: ${moduleNames.join(", ") || "none"}`);

		const allPlugins = this.container.getAll();
		this.logger.debug(`Total registered plugins: ${allPlugins.length}`);

		const activePlugins = allPlugins.filter((plugin) => {
			const meta = this.container.getMetadataForInstance(plugin);
			if (!meta) return false;

			const alwaysActive = plugin.shouldActivate?.(ctx) === true;
			if (alwaysActive) return true;

			const isSelected = moduleNames.includes(meta.name);
			if (!isSelected) return false;

			return !plugin.shouldActivate || plugin.shouldActivate(ctx) !== false;
		});

		const depErrors = this.validateActivePlugins(activePlugins, moduleNames);
		if (depErrors.length > 0) {
			this.logger.error(`❌ Plugin validation failed: ${depErrors.join(", ")}`);
			return this.emptyResult(depErrors);
		}

		const pluginNames = activePlugins.map((p) => this.getPluginDisplayName(p));
		this.logger.log(`📦 Active plugins (${activePlugins.length}): ${pluginNames.join(", ")}`);

		this.logger.debug("⏳ Running beforeGenerate hooks...");
		for (const plugin of activePlugins) {
			try {
				await plugin.beforeGenerate?.(ctx);
			} catch (error) {
				const name = this.getPluginName(plugin);
				this.logger.error(`❌ [${name}] beforeGenerate failed: ${error}`);
				errors.push(`[${name}] beforeGenerate failed: ${error}`);
			}
		}

		if (errors.length > 0) {
			return this.emptyResult(errors);
		}

		this.logger.debug("⚙️  Running generate methods...");
		for (const plugin of activePlugins) {
			try {
				const pluginStart = Date.now();
				const result = await plugin.generate(ctx);
				const pluginDuration = Date.now() - pluginStart;
				allResults.push(result);

				const name = this.getPluginDisplayName(plugin);
				const stats = this.getResultStats(result);
				this.logger.log(`  ✅ ${name} (${pluginDuration}ms) → ${stats}`);

				for (const file of result.files) {
					const key = `${file.path}/${file.name}`;
					ctx.files.set(key, file);
				}

				for (const pkg of result.packages) {
					if (!ctx.packages.some((p) => p.name === pkg.name)) {
						ctx.packages.push(pkg);
					}
				}

				for (const script of result.scripts) {
					if (!ctx.scripts.some((s) => s.name === script.name)) {
						ctx.scripts.push(script);
					}
				}

				for (const folder of result.rootFolders ?? []) {
					if (!ctx.rootFolders.includes(folder)) {
						ctx.rootFolders.push(folder);
					}
				}
			} catch (error) {
				const name = this.getPluginName(plugin);
				this.logger.error(`  ❌ [${name}] generate failed: ${error}`);
				errors.push(`[${name}] generate failed: ${error}`);
			}
		}

		if (errors.length > 0) {
			return this.emptyResult(errors);
		}

		this.logger.debug("📝 Processing file updates...");
		for (const result of allResults) {
			try {
				this.processFileUpdates(ctx, result.fileUpdates);
			} catch (error) {
				this.logger.error(`❌ File update failed: ${error}`);
				errors.push(`File update failed: ${error}`);
			}
		}

		this.logger.debug("⏳ Running afterGenerate hooks...");
		for (const plugin of activePlugins) {
			try {
				await plugin.afterGenerate?.(ctx);
			} catch (error) {
				const name = this.getPluginName(plugin);
				this.logger.error(`❌ [${name}] afterGenerate failed: ${error}`);
				errors.push(`[${name}] afterGenerate failed: ${error}`);
			}
		}

		const totalDuration = Date.now() - startTime;
		const totalFiles = ctx.files.size;
		const totalPackages = ctx.packages.length;
		const totalScripts = ctx.scripts.length;

		if (errors.length === 0) {
			this.logger.log(
				`✨ Generation complete in ${totalDuration}ms → ${totalFiles} files, ${totalPackages} packages, ${totalScripts} scripts`
			);
		}

		if (errors.length > 0) {
			this.logger.error(`❌ Generation failed with ${errors.length} error(s) after ${totalDuration}ms`);
		}

		return {
			files: Array.from(ctx.files.values()),
			packages: ctx.packages,
			scripts: ctx.scripts,
			rootFolders: ctx.rootFolders,
			success: errors.length === 0,
			errors
		};
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Function is complex but necessary for validating plugin dependencies and conflicts
	private validateActivePlugins(activePlugins: IGeneratorPlugin[], moduleNames: string[]): string[] {
		const errors: string[] = [];
		const activeNames = new Set(activePlugins.map((p) => this.getPluginName(p)));

		for (const plugin of activePlugins) {
			const metadata = this.container.getMetadataForInstance(plugin);
			if (!metadata) continue;

			for (const dep of metadata.dependencies || []) {
				if (!(activeNames.has(dep) || moduleNames.includes(dep))) {
					errors.push(`Plugin "${metadata.name}" requires "${dep}" to be enabled`);
				}
			}

			for (const conflict of metadata.conflicts || []) {
				if (activeNames.has(conflict) || moduleNames.includes(conflict)) {
					errors.push(`Plugin "${metadata.name}" conflicts with "${conflict}"`);
				}
			}
		}

		return errors;
	}

	private processFileUpdates(ctx: GeneratorContext, updates: FileUpdate[]): void {
		for (const update of updates) {
			const key = `${update.filePath}/${update.fileName}`;
			const file = ctx.files.get(key);

			if (!file) continue;

			switch (update.action) {
				case "append":
					file.content = `${file.content}\n${update.content}`;
					break;

				case "prepend":
					file.content = `${update.content}\n${file.content}`;
					break;

				case "replace":
					if (update.searchPattern) {
						file.content = file.content.replace(update.searchPattern, update.content);
					}
					break;

				case "insert-after":
					if (update.searchPattern) {
						file.content = file.content.replace(update.searchPattern, `$&\n${update.content}`);
					}
					break;

				case "insert-before":
					if (update.searchPattern) {
						file.content = file.content.replace(update.searchPattern, `${update.content}\n$&`);
					}
					break;
			}
		}
	}

	private getPluginName(plugin: IGeneratorPlugin): string {
		return this.container.getMetadataForInstance(plugin)?.name || "unknown";
	}

	private getPluginDisplayName(plugin: IGeneratorPlugin): string {
		const meta = this.container.getMetadataForInstance(plugin);
		return meta?.displayName || meta?.name || "unknown";
	}

	private getResultStats(result: PluginResult): string {
		const parts: string[] = [];
		if (result.files.length > 0) parts.push(`${result.files.length} file(s)`);
		if (result.packages.length > 0) parts.push(`${result.packages.length} pkg(s)`);
		if (result.scripts.length > 0) parts.push(`${result.scripts.length} script(s)`);
		if (result.fileUpdates.length > 0) parts.push(`${result.fileUpdates.length} update(s)`);
		return parts.length > 0 ? parts.join(", ") : "no changes";
	}

	private emptyResult(errors: string[]): ExecutionResult {
		return {
			files: [],
			packages: [],
			scripts: [],
			rootFolders: [],
			success: false,
			errors
		};
	}
}
