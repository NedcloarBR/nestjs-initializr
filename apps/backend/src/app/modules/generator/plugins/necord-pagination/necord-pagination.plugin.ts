import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import {
	necordPaginationCommandUpdates,
	necordPaginationConfigIntegration,
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

		if (this.withConfig) {
			this.setupConfigIntegration();
		}

		this.createFile(paginationServiceTemplate.name, paginationServiceTemplate.path, paginationServiceTemplate.content);

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

		this.addPkg("@necord/pagination");

		this.setConstants({
			importIn: "src/modules/necord/necord.module.ts",
			importArray: moduleUpdates.moduleConfig.content
		});
	}

	private setupConfigIntegration(): void {
		const { importString, configFunction } = necordPaginationConfigIntegration;

		this.replaceInFile(importString.path, importString.name, importString.replacer, importString.content);

		this.replaceInFile(configFunction.path, configFunction.name, configFunction.replacer, configFunction.content);
	}
}
