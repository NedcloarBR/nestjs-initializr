import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import {
	necordCommandTemplate,
	necordConfigIntegration,
	necordConfigTemplate,
	necordEnvDtoTemplate,
	necordFileUpdates,
	necordModuleTemplate,
	necordServiceTemplate
} from "./templates";

/**
 * Necord Plugin - Discord bot framework for NestJS
 *
 * This plugin creates:
 * - src/modules/necord/necord.module.ts (NecordWrapperModule)
 * - src/modules/necord/necord.service.ts (event handlers)
 * - src/modules/necord/necord.command.ts (slash commands)
 * - Updates .env with Discord tokens
 *
 * When config module is enabled:
 * - src/modules/necord/necord.config.ts (async config factory)
 * - src/modules/necord/dtos/discord-env.dto.ts (env validation)
 */
@Plugin({
	name: "necord",
	displayName: "Necord",
	description: "Discord bot framework with slash commands and event handling",
	priority: 400,
	dependencies: ["config"] // Optional dependency
})
export class NecordPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("necord") ?? false;
	}

	protected onGenerate(): void {
		// Create necord module
		const moduleTemplate = necordModuleTemplate(this.withConfig);
		this.createFile(moduleTemplate.name, moduleTemplate.path, moduleTemplate.content);

		// Create service and command
		this.createFile(necordServiceTemplate.name, necordServiceTemplate.path, necordServiceTemplate.content);
		this.createFile(necordCommandTemplate.name, necordCommandTemplate.path, necordCommandTemplate.content);

		// Update .env with Discord tokens
		this.appendToFile("", ".env", `\n${necordFileUpdates.dotenv.content}`);

		// Config module integration
		if (this.withConfig) {
			this.setupConfigIntegration();
		}

		// Add dependencies
		this.addPkg("necord");
		this.addPkg("discord.js");

		// Set constants for other plugins
		this.setConstants({
			token: null,
			import: "NecordWrapperModule",
			export: 'export { NecordWrapperModule } from "./necord/necord.module";',
			importArray: "NecordWrapperModule",
			inject: null,
			importIn: "src/app.module.ts"
		});
	}

	private setupConfigIntegration(): void {
		// Create config-related files
		this.createFile(necordConfigTemplate.name, necordConfigTemplate.path, necordConfigTemplate.content);
		this.createFile(necordEnvDtoTemplate.name, necordEnvDtoTemplate.path, necordEnvDtoTemplate.content);

		// Update index.d.ts with Discord env types
		this.replaceInFile(
			"src/types",
			"index.d.ts",
			necordConfigIntegration.indexDTs.replacer,
			necordConfigIntegration.indexDTs.content
		);

		// Update config module imports
		this.replaceInFile(
			"src/modules/config",
			"config.module.ts",
			necordConfigIntegration.configModuleImport.replacer,
			necordConfigIntegration.configModuleImport.content
		);
		this.replaceInFile(
			"src/modules/config",
			"config.module.ts",
			necordConfigIntegration.configModuleLoad.replacer,
			necordConfigIntegration.configModuleLoad.content
		);

		// Update config service types
		this.replaceInFile(
			"src/modules/config",
			"config.service.ts",
			necordConfigIntegration.configServiceImport.replacer,
			necordConfigIntegration.configServiceImport.content
		);
		this.replaceInFile(
			"src/modules/config",
			"config.service.ts",
			necordConfigIntegration.configServiceType.replacer,
			necordConfigIntegration.configServiceType.content
		);
	}
}
