import "reflect-metadata";
import type { PluginConstructor } from "../interfaces";

export const PLUGIN_METADATA = Symbol("PLUGIN_METADATA");

export interface PluginOptions {
	name: string;
	displayName: string;
	description?: string;
	version?: string;
	dependencies?: string[];
	conflicts?: string[];
	priority?: number;
}

/**
 * Global registry of all plugins decorated with @Plugin
 * Plugins are automatically registered when their module is imported
 */
class PluginRegistry {
	private static instance: PluginRegistry;
	private readonly plugins = new Map<string, PluginConstructor>();

	private constructor() {}

	static getInstance(): PluginRegistry {
		if (!PluginRegistry.instance) {
			PluginRegistry.instance = new PluginRegistry();
		}
		return PluginRegistry.instance;
	}

	register(name: string, plugin: PluginConstructor): void {
		if (this.plugins.has(name)) {
			console.warn(`Plugin "${name}" is already registered. Skipping duplicate.`);
			return;
		}
		this.plugins.set(name, plugin);
	}

	get(name: string): PluginConstructor | undefined {
		return this.plugins.get(name);
	}

	getAll(): PluginConstructor[] {
		return Array.from(this.plugins.values());
	}

	has(name: string): boolean {
		return this.plugins.has(name);
	}

	get size(): number {
		return this.plugins.size;
	}

	clear(): void {
		this.plugins.clear();
	}
}

/** Global plugin registry instance */
export const pluginRegistry = PluginRegistry.getInstance();

/**
 * Decorator to mark a class as a Generator Plugin
 * Automatically registers the plugin in the global registry
 *
 * @example
 * ```typescript
 * @Plugin({
 *   name: "config",
 *   displayName: "Config Module",
 *   dependencies: [],
 * })
 * export class ConfigPlugin extends BasePlugin {
 *   // ...
 * }
 * ```
 */
export function Plugin(options: PluginOptions): ClassDecorator {
	return (target: object) => {
		Reflect.defineMetadata(PLUGIN_METADATA, options, target);

		pluginRegistry.register(options.name, target as PluginConstructor);
	};
}

/**
 * Get plugin metadata from a decorated class
 */
export function getPluginMetadata(target: object): PluginOptions | undefined {
	return Reflect.getMetadata(PLUGIN_METADATA, target);
}
