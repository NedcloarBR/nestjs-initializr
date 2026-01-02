import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import {
	necordPaginationCommandUpdates,
	necordPaginationModuleUpdates,
	paginationServiceTemplate
} from "./templates";

/**
 * Necord Pagination Plugin - Paginated embeds for Discord bots
 *
 * This plugin adds:
 * - necord.pagination.ts service for creating paginated messages
 * - Updates necord.module.ts with NecordPaginationModule
 * - Updates necord.command.ts with pagination command example
 *
 * Requires: necord plugin
 */
@Plugin({
	name: "necord-pagination",
	displayName: "Necord Pagination",
	description: "Paginated embeds and messages for Discord bots",
	priority: 350,
	dependencies: ["necord"]
})
export class NecordPaginationPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("necord-pagination") ?? false;
	}

	protected onGenerate(): void {
		const moduleUpdates = necordPaginationModuleUpdates(this.withConfig);

		// Create pagination service
		this.createFile(
			paginationServiceTemplate.name,
			paginationServiceTemplate.path,
			paginationServiceTemplate.content
		);

		// Update necord module
		this.replaceInFile(
			"src/modules/necord",
			"necord.module.ts",
			moduleUpdates.importNecordPagination.replacer,
			moduleUpdates.importNecordPagination.content
		);
		this.replaceInFile(
			"src/modules/necord",
			"necord.module.ts",
			moduleUpdates.importService.replacer,
			moduleUpdates.importService.content
		);
		this.replaceInFile(
			"src/modules/necord",
			"necord.module.ts",
			moduleUpdates.providers.replacer,
			moduleUpdates.providers.content
		);

		// Update necord command
		this.replaceInFile(
			"src/modules/necord",
			"necord.command.ts",
			necordPaginationCommandUpdates.addImport.replacer,
			necordPaginationCommandUpdates.addImport.content
		);
		this.replaceInFile(
			"src/modules/necord",
			"necord.command.ts",
			necordPaginationCommandUpdates.addConstructor.replacer,
			necordPaginationCommandUpdates.addConstructor.content
		);
		this.replaceInFile(
			"src/modules/necord",
			"necord.command.ts",
			necordPaginationCommandUpdates.addCommand.replacer,
			necordPaginationCommandUpdates.addCommand.content
		);

		// Add dependency
		this.addPkg("@necord/pagination");
	}
}
