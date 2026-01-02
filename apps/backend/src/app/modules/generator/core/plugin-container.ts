import { Injectable } from "@nestjs/common";
import { getInjectMetadata, getPluginMetadata, type PluginOptions } from "@/app/common/decorators";
import type { IGeneratorPlugin, PluginConstructor } from "@/app/common/interfaces";

interface PluginRegistration {
	instance: IGeneratorPlugin;
	metadata: PluginOptions;
}

/**
 * Simple dependency injection container for plugins
 * Similar to NestJS IoC container
 */
@Injectable()
export class PluginContainer {
	private plugins: Map<string, PluginRegistration> = new Map();
	private instances: Map<PluginConstructor, IGeneratorPlugin> = new Map();

	/**
	 * Register a plugin class
	 */
	public register(PluginClass: PluginConstructor): void {
		const metadata = getPluginMetadata(PluginClass);

		if (!metadata) {
			throw new Error(`Class ${PluginClass.name} is not decorated with @Plugin()`);
		}

		if (this.plugins.has(metadata.name)) {
			throw new Error(`Plugin "${metadata.name}" is already registered`);
		}

		// Resolve dependencies and create instance
		const instance = this.createInstance(PluginClass);

		this.plugins.set(metadata.name, { instance, metadata });
		this.instances.set(PluginClass, instance);
	}

	/**
	 * Register multiple plugin classes
	 */
	public registerAll(plugins: PluginConstructor[]): void {
		// First pass: register all without instantiation to know what's available
		const metadataMap = new Map<string, PluginConstructor>();

		for (const PluginClass of plugins) {
			const metadata = getPluginMetadata(PluginClass);
			if (!metadata) {
				throw new Error(`Class ${PluginClass.name} is not decorated with @Plugin()`);
			}
			metadataMap.set(metadata.name, PluginClass);
		}

		// Sort by dependencies (topological sort)
		const sorted = this.sortByDependencies(plugins, metadataMap);

		// Register in order
		for (const PluginClass of sorted) {
			this.register(PluginClass);
		}
	}

	/**
	 * Get a plugin instance by name
	 */
	public get<T extends IGeneratorPlugin>(name: string): T | undefined {
		return this.plugins.get(name)?.instance as T | undefined;
	}

	/**
	 * Get a plugin instance by class
	 */
	public getByClass<T extends IGeneratorPlugin>(PluginClass: PluginConstructor): T | undefined {
		return this.instances.get(PluginClass) as T | undefined;
	}

	/**
	 * Get all registered plugins in priority order
	 */
	public getAll(): IGeneratorPlugin[] {
		return Array.from(this.plugins.values())
			.sort((a, b) => (b.metadata.priority || 0) - (a.metadata.priority || 0))
			.map((reg) => reg.instance);
	}

	/**
	 * Get plugins by names
	 */
	public getByNames(names: string[]): IGeneratorPlugin[] {
		const all = this.getAll();
		return all.filter((plugin) => {
			const meta = this.getMetadataForInstance(plugin);
			return meta && names.includes(meta.name);
		});
	}

	/**
	 * Get metadata for a plugin instance
	 */
	public getMetadataForInstance(instance: IGeneratorPlugin): PluginOptions | undefined {
		for (const [, reg] of this.plugins) {
			if (reg.instance === instance) {
				return reg.metadata;
			}
		}
		return undefined;
	}

	/**
	 * Check if a plugin is registered
	 */
	public has(name: string): boolean {
		return this.plugins.has(name);
	}

	/**
	 * Initialize all plugins (call onModuleInit)
	 */
	public async initAll(): Promise<void> {
		for (const plugin of this.getAll()) {
			await plugin.onModuleInit?.();
		}
	}

	/**
	 * Validate dependencies between plugins
	 */
	public validateDependencies(): string[] {
		const errors: string[] = [];

		for (const [name, { metadata }] of this.plugins) {
			for (const dep of metadata.dependencies || []) {
				if (!this.plugins.has(dep)) {
					errors.push(`Plugin "${name}" requires "${dep}" which is not registered`);
				}
			}

			for (const conflict of metadata.conflicts || []) {
				if (this.plugins.has(conflict)) {
					errors.push(`Plugin "${name}" conflicts with "${conflict}"`);
				}
			}
		}

		return errors;
	}

	/**
	 * Clear all registered plugins
	 */
	public clear(): void {
		this.plugins.clear();
		this.instances.clear();
	}

	/**
	 * Create an instance with dependency injection
	 */
	private createInstance(PluginClass: PluginConstructor): IGeneratorPlugin {
		const injections = getInjectMetadata(PluginClass);

		if (injections.size === 0) {
			return new PluginClass();
		}

		// Build constructor args array
		const args: unknown[] = [];
		const sortedIndices = Array.from(injections.keys()).sort((a, b) => a - b);

		for (const index of sortedIndices) {
			const pluginName = injections.get(index);
			if (!pluginName) continue;

			const dependency = this.get(pluginName);
			if (!dependency) {
				throw new Error(
					`Cannot inject plugin "${pluginName}" into ${PluginClass.name}: plugin not found. ` +
						`Make sure "${pluginName}" is registered before ${PluginClass.name}`
				);
			}
			args[index] = dependency;
		}

		return new PluginClass(...args);
	}

	/**
	 * Topological sort based on dependencies
	 */
	private sortByDependencies(
		plugins: PluginConstructor[],
		metadataMap: Map<string, PluginConstructor>
	): PluginConstructor[] {
		const visited = new Set<string>();
		const result: PluginConstructor[] = [];

		const visit = (PluginClass: PluginConstructor) => {
			const metadata = getPluginMetadata(PluginClass);
			if (!metadata || visited.has(metadata.name)) return;

			visited.add(metadata.name);

			// Visit dependencies first
			for (const depName of metadata.dependencies || []) {
				const depClass = metadataMap.get(depName);
				if (depClass) {
					visit(depClass);
				}
			}

			result.push(PluginClass);
		};

		// Sort by priority first, then visit
		const sorted = [...plugins].sort((a, b) => {
			const metaA = getPluginMetadata(a);
			const metaB = getPluginMetadata(b);
			return (metaB?.priority || 0) - (metaA?.priority || 0);
		});

		for (const plugin of sorted) {
			visit(plugin);
		}

		return result;
	}

	public get size(): number {
		return this.plugins.size;
	}
}
