import { Logger, Module, type OnModuleInit } from "@nestjs/common";
import { pluginRegistry } from "../../common/decorators";
import { loadPluginsSync, PluginContainer, PluginExecutor } from "./core";
import { GeneratorController } from "./generator.controller";
import { PluginGeneratorService } from "./plugin-generator.service";

// Auto-discover and load all plugins from the plugins directory
loadPluginsSync();

/**
 * NestJS module for the plugin-based generator system
 *
 * Plugins are automatically discovered from the `plugins/` directory
 * Any file matching `*.plugin.ts` will be loaded and registered via @Plugin decorator
 */
@Module({
	controllers: [GeneratorController],
	providers: [PluginGeneratorService, PluginContainer, PluginExecutor],
	exports: [PluginGeneratorService]
})
export class PluginGeneratorModule implements OnModuleInit {
	private readonly logger = new Logger(PluginGeneratorModule.name);

	public constructor(private readonly container: PluginContainer) {}

	public async onModuleInit(): Promise<void> {
		const startTime = Date.now();

		// Register all auto-registered plugins from the global registry
		const plugins = pluginRegistry.getAll();
		this.container.registerAll(plugins);

		// Initialize all plugins
		await this.container.initAll();

		// Validate plugin dependencies
		const errors = this.container.validateDependencies();
		if (errors.length > 0) {
			this.logger.error(`❌ Plugin validation errors: ${errors.join(", ")}`);
		}

		const duration = Date.now() - startTime;
		const pluginList = this.getPluginsSummary();

		this.logger.log(`🔌 Registered ${this.container.size} plugin(s) in ${duration}ms`);
		this.logger.log(`📋 Plugins: ${pluginList}`);
	}

	private getPluginsSummary(): string {
		const plugins = this.container.getAll();
		return plugins
			.map((p) => {
				const meta = this.container.getMetadataForInstance(p);
				return meta?.displayName || meta?.name || "unknown";
			})
			.join(", ");
	}
}

