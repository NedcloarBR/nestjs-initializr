import type {
	FileUpdate,
	GeneratedFile,
	GeneratorContext,
	IGeneratorPlugin,
	PackageDependency,
	PluginConstants,
	PluginResult,
	Script
} from "@/app/common/interfaces";
import { DEV_NPM_DEPENDENCIES, NPM_DEPENDENCIES } from "@/app/constants/packages";
import type { ExtraNames, ModuleNames, ModuleTemplate, Template } from "@/types";

/**
 * Abstract base class for generator plugins
 * Provides utility methods for common operations
 *
 * Similar to how NestJS services extend base classes
 */
export abstract class BasePlugin implements IGeneratorPlugin {
	protected ctx!: GeneratorContext;

	private _files: GeneratedFile[] = [];
	private _packages: PackageDependency[] = [];
	private _scripts: Script[] = [];
	private _fileUpdates: FileUpdate[] = [];
	private _constants?: PluginConstants;
	private _rootFolders: string[] = [];

	/**
	 * Called when the plugin is initialized
	 * Override this to add setup logic
	 */
	public onModuleInit?(): Promise<void> | void;

	/**
	 * Check if this plugin should be enabled based on context
	 * Override this to control activation
	 * Return true to always activate, false to never activate
	 */
	public shouldActivate?(_ctx: GeneratorContext): boolean;

	/**
	 * Called before the plugin generates files
	 * Override this for validation or preparation
	 */
	protected onBeforeGenerate?(): Promise<void> | void;

	/**
	 * Called after all plugins have generated
	 * Override this for cleanup or final modifications
	 */
	protected onAfterGenerate?(): Promise<void> | void;

	/**
	 * Implement this method to define your generation logic
	 */
	protected abstract onGenerate(): Promise<void> | void;

	/**
	 * Hook called before generation - delegates to onBeforeGenerate
	 */
	public async beforeGenerate(ctx: GeneratorContext): Promise<void> {
		this.ctx = ctx;
		await this.onBeforeGenerate?.();
	}

	/**
	 * Hook called after generation - delegates to onAfterGenerate
	 */
	public async afterGenerate(_ctx: GeneratorContext): Promise<void> {
		await this.onAfterGenerate?.();
	}

	/**
	 * Main generate method - sets up context and delegates to onGenerate
	 */
	public async generate(ctx: GeneratorContext): Promise<PluginResult> {
		this.ctx = ctx;
		this.reset();

		await this.onGenerate();

		return {
			files: this._files,
			packages: this._packages,
			scripts: this._scripts,
			fileUpdates: this._fileUpdates,
			constants: this._constants,
			rootFolders: this._rootFolders
		};
	}

	/**
	 * Reset collections for a fresh generation
	 */
	private reset(): void {
		this._files = [];
		this._packages = [];
		this._scripts = [];
		this._fileUpdates = [];
		this._constants = undefined;
		this._rootFolders = [];
	}

	/**
	 * Add a file to be generated
	 */
	protected createFile(name: string, path: string, content: string): void {
		this._files.push({ name, path, content: content.trim() });
	}

	/**
	 * Update an existing file
	 */
	protected updateFile(
		filePath: string,
		fileName: string,
		action: FileUpdate["action"],
		content: string,
		searchPattern?: string | RegExp
	): void {
		this._fileUpdates.push({
			filePath,
			fileName,
			action,
			content,
			searchPattern
		});
	}

	/**
	 * Append content to a file
	 */
	protected appendToFile(filePath: string, fileName: string, content: string): void {
		this.updateFile(filePath, fileName, "append", content);
	}

	/**
	 * Replace content in a file
	 */
	protected replaceInFile(filePath: string, fileName: string, search: string | RegExp, content: string): void {
		this.updateFile(filePath, fileName, "replace", content, search);
	}

	/**
	 * Add a package dependency
	 */
	protected addDependency(name: string, version: string, dev = false): void {
		this._packages.push({ name, version, dev });
	}

	/**
	 * Add a dev dependency
	 */
	protected addDevDependency(name: string, version: string): void {
		this._packages.push({ name, version, dev: true });
	}

	/**
	 * Add a dependency by name (auto-fetches version from NPM_DEPENDENCIES)
	 */
	protected addPkg(name: keyof typeof NPM_DEPENDENCIES): void {
		const pkg = NPM_DEPENDENCIES[name];
		this._packages.push({ name: pkg.name, version: pkg.version, dev: false });
	}

	/**
	 * Add a dev dependency by name (auto-fetches version from DEV_NPM_DEPENDENCIES)
	 */
	protected addDevPkg(name: keyof typeof DEV_NPM_DEPENDENCIES): void {
		const pkg = DEV_NPM_DEPENDENCIES[name];
		this._packages.push({ name: pkg.name, version: pkg.version, dev: true });
	}

	/**
	 * Add multiple dependencies
	 */
	protected addDependencies(packages: Array<{ name: string; version: string; dev?: boolean }>): void {
		for (const pkg of packages) {
			this._packages.push({
				name: pkg.name,
				version: pkg.version,
				dev: pkg.dev
			});
		}
	}

	/**
	 * Add an npm script
	 */
	protected addScript(name: string, command: string): void {
		this._scripts.push({ name, command });
	}

	/**
	 * Register a root folder to be included in the zip
	 * Use this for folders that should be at the project root (e.g., "prisma", "scripts")
	 */
	protected addRootFolder(folderName: string): void {
		if (!this._rootFolders.includes(folderName)) {
			this._rootFolders.push(folderName);
		}
	}

	/**
	 * Set module constants for integration
	 */
	protected setConstants(constants: PluginConstants): void {
		this._constants = constants;
	}

	/**
	 * Check if a module is enabled
	 */
	protected hasModule(name: ModuleNames): boolean {
		return this.ctx.metadata.modules?.includes(name) ?? false;
	}

	/**
	 * Check if an extra is enabled
	 */
	protected hasExtra(name: ExtraNames): boolean {
		return this.ctx.metadata.extras?.includes(name) ?? false;
	}

	/**
	 * Check if config module is enabled
	 */
	protected get withConfig(): boolean {
		return this.hasModule("config");
	}

	/**
	 * Get the main type (fastify or express)
	 */
	protected get mainType(): "fastify" | "express" {
		return this.ctx.metadata.mainType;
	}

	/**
	 * Check if using Fastify
	 */
	protected get isFastify(): boolean {
		return this.mainType === "fastify";
	}

	/**
	 * Check if using Express
	 */
	protected get isExpress(): boolean {
		return this.mainType === "express";
	}

	/**
	 * Get the package manager
	 */
	protected get packageManager(): "npm" | "yarn" | "pnpm" {
		return this.ctx.metadata.packageManager;
	}

	/**
	 * Get project name from packageJson
	 */
	protected get projectName(): string {
		return this.ctx.metadata.packageJson.name;
	}

	/**
	 * Get project description from packageJson
	 */
	protected get projectDescription(): string {
		return this.ctx.metadata.packageJson.description ?? "";
	}

	/**
	 * Get node version from packageJson
	 */
	protected get nodeVersion(): string {
		return this.ctx.metadata.packageJson.nodeVersion;
	}

	/**
	 * Get the linter/formatter
	 */
	protected get linterFormatter(): "biome" | "eslint-prettier" | undefined {
		return this.ctx.metadata.linterFormatter;
	}

	/**
	 * Get the test runner
	 */
	protected get testRunner(): "jest" | "vitest" | undefined {
		return this.ctx.metadata.testRunner;
	}

	/**
	 * Check if docker is enabled
	 */
	protected get withDocker(): boolean {
		return this.ctx.metadata.docker ?? false;
	}

	/**
	 * Set a value in the shared state
	 */
	protected setState<T>(key: string, value: T): void {
		this.ctx.state.set(key, value);
	}

	/**
	 * Get a value from the shared state
	 */
	protected getState<T>(key: string): T | undefined {
		return this.ctx.state.get(key) as T | undefined;
	}

	/**
	 * Check if a state key exists
	 */
	protected hasState(key: string): boolean {
		return this.ctx.state.has(key);
	}

	/**
	 * Resolve a Template (static or dynamic) to a StaticTemplate
	 */
	private resolveTemplate(template: Template): { name: string; path: string; content: string } {
		if (typeof template === "function") {
			return template(this.mainType);
		}
		return template;
	}

	/**
	 * Generate files from an existing ModuleTemplate
	 * This integrates with the existing template system
	 */
	protected generateFromModuleTemplate(moduleTemplate: ModuleTemplate): void {
		for (const t of moduleTemplate.templates) {
			const resolved = this.resolveTemplate(t);
			this.createFile(resolved.name, resolved.path, resolved.content);
		}

		if (moduleTemplate.filesToUpdate) {
			for (const update of moduleTemplate.filesToUpdate) {
				for (const t of update.templates) {
					this.replaceInFile(update.path, update.name, t.replacer, t.content);
				}
			}
		}

		if (moduleTemplate.mainTemplates) {
			for (const t of moduleTemplate.mainTemplates) {
				this.replaceInFile("src", "main.ts", t.replacer, t.content);
			}
		}

		if (moduleTemplate.packages) {
			this.addDependencies(moduleTemplate.packages);
		}

		if (moduleTemplate.scripts) {
			for (const script of moduleTemplate.scripts) {
				this.addScript(script.name, script.command);
			}
		}

		if (moduleTemplate.constants) {
			this.setConstants(moduleTemplate.constants);
		}
	}
}
