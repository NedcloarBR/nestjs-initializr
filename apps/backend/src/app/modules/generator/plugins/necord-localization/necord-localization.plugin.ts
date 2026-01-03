import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import {
	jsonLocaleLoaderTemplate,
	necordLocalizationCommandUpdates,
	necordLocalizationModuleUpdates,
	pingTranslationTemplate
} from "./templates";

/**
 * Necord Localization Plugin - i18n support for Discord bots
 *
 * This plugin adds:
 * - JSONLocale.loader.ts for loading translations from JSON files
 * - Example ping translation file
 * - Updates necord.module.ts with NecordLocalizationModule
 * - Updates necord.command.ts with localization decorators
 *
 * Requires: necord plugin
 */
@Plugin({
	name: "necord-localization",
	displayName: "Necord Localization",
	description: "Internationalization support for Discord bot commands",
	priority: 350,
	dependencies: ["necord"]
})
export class NecordLocalizationPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("necord-localization") ?? false;
	}

	protected onGenerate(): void {
		const moduleUpdates = necordLocalizationModuleUpdates(this.withConfig);

		if (this.withConfig) {
			this.createFile(jsonLocaleLoaderTemplate.name, jsonLocaleLoaderTemplate.path, jsonLocaleLoaderTemplate.content);
		}

		this.createFile(pingTranslationTemplate.name, pingTranslationTemplate.path, pingTranslationTemplate.content);

		this.replaceInFile(
			"src/modules/necord",
			"necord.module.ts",
			moduleUpdates.moduleImport.replacer,
			moduleUpdates.moduleImport.content
		);

		this.replaceInFile(
			"src/modules/necord",
			"necord.command.ts",
			necordLocalizationCommandUpdates.import.replacer,
			necordLocalizationCommandUpdates.import.content
		);
		this.replaceInFile(
			"src/modules/necord",
			"necord.command.ts",
			necordLocalizationCommandUpdates.description.replacer,
			necordLocalizationCommandUpdates.description.content
		);
		this.replaceInFile(
			"src/modules/necord",
			"necord.command.ts",
			necordLocalizationCommandUpdates.context.replacer,
			necordLocalizationCommandUpdates.context.content
		);
		this.replaceInFile(
			"src/modules/necord",
			"necord.command.ts",
			necordLocalizationCommandUpdates.reply.replacer,
			necordLocalizationCommandUpdates.reply.content
		);

		this.addPkg("@necord/localization");
	}
}
