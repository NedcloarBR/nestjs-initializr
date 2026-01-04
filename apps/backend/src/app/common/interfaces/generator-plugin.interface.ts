import type { GeneratorContext } from "./generator-context.interface";

/**
 * Result returned by a plugin's generate method
 */
export interface PluginResult {
	files: GeneratedFile[];
	packages: PackageDependency[];
	scripts: Script[];
	fileUpdates: FileUpdate[];
	constants?: PluginConstants;
	rootFolders?: string[];
}

export interface GeneratedFile {
	name: string;
	path: string;
	content: string;
}

export interface PackageDependency {
	name: string;
	version: string;
	dev: boolean;
}

export interface Script {
	name: string;
	command: string;
}

export interface FileUpdate {
	filePath: string;
	fileName: string;
	action: "replace" | "append" | "prepend" | "insert-after" | "insert-before";
	searchPattern?: string | RegExp;
	content: string;
}

export interface PluginConstants {
	token?: string;
	import?: string;
	export?: string;
	importArray?: string;
	inject?: string;
	importIn?: string;
}

/**
 * Interface that all generator plugins must implement
 * Similar to NestJS module/provider pattern
 */
export interface IGeneratorPlugin {
	/**
	 * Called when the plugin is initialized
	 * Use for setup logic
	 */
	onModuleInit?(): Promise<void> | void;

	/**
	 * Called before the plugin generates files
	 * Use for validation or preparation
	 */
	beforeGenerate?(ctx: GeneratorContext): Promise<void> | void;

	/**
	 * Main generation method
	 * Returns all files, packages, and updates this plugin needs
	 */
	generate(ctx: GeneratorContext): Promise<PluginResult> | PluginResult;

	/**
	 * Called after all plugins have generated
	 * Use for cleanup or final modifications
	 */
	afterGenerate?(ctx: GeneratorContext): Promise<void> | void;

	/**
	 * Check if this plugin should be enabled based on context
	 */
	shouldActivate?(ctx: GeneratorContext): boolean;
}

/**
 * Type for plugin class constructor
 */
export type PluginConstructor = new (...args: unknown[]) => IGeneratorPlugin;
