import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import {
	lavalinkApplicationYmlTemplate,
	lavalinkDockerComposeTemplate,
	lavalinkDockerfileTemplate,
	lavalinkListenersTemplate,
	lavalinkModuleUpdates,
	playCommandTemplate,
	pluginsGitkeepTemplate,
	queryDtoTemplate,
	sourceAutocompleteTemplate
} from "./templates";

/**
 * Necord Lavalink Plugin - Music player integration for Discord bots
 *
 * This plugin adds:
 * - Play command with source autocomplete
 * - Lavalink listeners service
 * - Docker setup for Lavalink server
 * - application.yml configuration
 *
 * Requires: necord plugin
 */
@Plugin({
	name: "necord-lavalink",
	displayName: "Necord Lavalink",
	description: "Music player with Lavalink for Discord bots",
	priority: 350,
	dependencies: ["necord"]
})
export class NecordLavalinkPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("necord-lavalink") ?? false;
	}

	protected onGenerate(): void {
		const moduleUpdates = lavalinkModuleUpdates(this.withConfig);

		this.createFile(lavalinkListenersTemplate.name, lavalinkListenersTemplate.path, lavalinkListenersTemplate.content);

		this.createFile(playCommandTemplate.name, playCommandTemplate.path, playCommandTemplate.content);
		this.createFile(queryDtoTemplate.name, queryDtoTemplate.path, queryDtoTemplate.content);
		this.createFile(
			sourceAutocompleteTemplate.name,
			sourceAutocompleteTemplate.path,
			sourceAutocompleteTemplate.content
		);

		this.createFile(
			lavalinkDockerfileTemplate.name,
			lavalinkDockerfileTemplate.path,
			lavalinkDockerfileTemplate.content
		);
		this.createFile(
			lavalinkDockerComposeTemplate.name,
			lavalinkDockerComposeTemplate.path,
			lavalinkDockerComposeTemplate.content
		);
		this.createFile(
			lavalinkApplicationYmlTemplate.name,
			lavalinkApplicationYmlTemplate.path,
			lavalinkApplicationYmlTemplate.content
		);
		this.createFile(pluginsGitkeepTemplate.name, pluginsGitkeepTemplate.path, pluginsGitkeepTemplate.content);

		this.replaceInFile(
			"src/modules/necord",
			"necord.module.ts",
			moduleUpdates.importLavalink.replacer,
			moduleUpdates.importLavalink.content
		);
		this.replaceInFile(
			"src/modules/necord",
			"necord.module.ts",
			moduleUpdates.importCommands.replacer,
			moduleUpdates.importCommands.content
		);
		this.replaceInFile(
			"src/modules/necord",
			"necord.module.ts",
			moduleUpdates.providers.replacer,
			moduleUpdates.providers.content
		);

		this.addPkg("@necord/lavalink");
		this.addPkg("lavalink-client");
	}
}
