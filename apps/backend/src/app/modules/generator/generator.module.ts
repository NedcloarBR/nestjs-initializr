import { Logger, Module, type OnModuleInit } from "@nestjs/common";
import { pluginRegistry } from "../../common/decorators";
import { loadPluginsSync, PluginContainer, PluginExecutor } from "./core";
import { GeneratorController } from "./generator.controller";
import { PluginGeneratorService } from "./plugin-generator.service";

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

		const plugins = pluginRegistry.getAll();
		this.container.registerAll(plugins);

		await this.container.initAll();

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
