import { Logger } from "@nestjs/common";
import { getPluginMetadata, pluginRegistry } from "@/app/common/decorators";

const logger = new Logger("PluginLoader");

/**
 * Auto-discovers and loads all plugin files from the plugins directory
 * Uses webpack's require.context for build-time discovery
 *
 * Plugins are found by matching the pattern `*.plugin.ts`
 */
export function loadPluginsSync(): void {
	const startTime = Date.now();
	logger.log("🔍 Discovering plugins...");

	try {
		const pluginContext = require.context("../plugins", true, /\.plugin\.(ts|js)$/);

		const pluginKeys = pluginContext.keys();
		logger.debug(`Found ${pluginKeys.length} plugin file(s)`);

		const initialCount = pluginRegistry.size;
		const failedPlugins: string[] = [];

		for (const key of pluginKeys) {
			try {
				pluginContext(key);
			} catch (error) {
				const pluginName = key.replace(/^\.\//, "").replace(/\/.*$/, "");
				failedPlugins.push(pluginName);
				logger.error(`  ❌ Failed to load ${key}:`, error);
			}
		}

		const loadedPlugins = pluginRegistry.getAll();
		const newPlugins = loadedPlugins.slice(initialCount);

		for (const PluginClass of newPlugins) {
			const meta = getPluginMetadata(PluginClass);
			if (meta) {
				const name = meta.displayName || meta.name;
				const priority = meta.priority ? ` (priority: ${meta.priority})` : "";
				logger.debug(`  📦 ${name}${priority}`);
			}
		}

		const duration = Date.now() - startTime;
		const pluginNames = newPlugins
			.map((p) => {
				const meta = getPluginMetadata(p);
				return meta?.displayName || meta?.name || "unknown";
			})
			.join(", ");

		if (failedPlugins.length === 0) {
			logger.log(`✅ Loaded ${newPlugins.length} plugin(s) in ${duration}ms`);
			logger.log(`📋 ${pluginNames}`);
		} else {
			logger.warn(
				`⚠️  Loaded ${newPlugins.length} plugin(s), ${failedPlugins.length} failed in ${duration}ms`
			);
		}
	} catch (error) {
		logger.error("❌ Failed to discover plugins:", error);
	}
}

/**
 * Async version for use in dynamic imports
 */
export async function loadPlugins(): Promise<void> {
	loadPluginsSync();
}

