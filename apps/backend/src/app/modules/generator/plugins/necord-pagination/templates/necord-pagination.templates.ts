/**
 * Necord Pagination templates - Paginated embeds for Discord bots
 */

// ============================================
// Pagination Service Template
// ============================================

export const paginationServiceTemplate = {
	name: "necord.pagination.ts",
	path: "src/modules/necord",
	content: `
import { OnModuleInit, Injectable } from "@nestjs/common";
import { NecordPaginationService, PageBuilder } from "@necord/pagination";

@Injectable()
export class NecordPagination implements OnModuleInit {
  public constructor(private readonly paginationService: NecordPaginationService) {}

  public onModuleInit() {
    return this.paginationService.register(builder =>
      builder
        .setCustomId("test")
        .setPages([
          new PageBuilder().setContent("Page 1"),
          new PageBuilder().setContent("Page 2"),
          new PageBuilder().setContent("Page 3"),
          new PageBuilder().setContent("Page 4"),
          new PageBuilder().setContent("Page 5")
        ])
        .setPagesFactory(page => new PageBuilder().setContent(\`Page \${page}\`))
        .setMaxPages(5)
    );
  }
}
`.trim()
};

// ============================================
// File Updates
// ============================================

export function necordPaginationModuleUpdates(withConfigModule: boolean) {
	return {
		importNecordPagination: {
			replacer: 'import { NecordModule } from "necord";',
			content: `import { NecordModule } from "necord";
import { NecordPaginationModule } from "@necord/pagination";`
		},
		importService: {
			replacer: 'import { NecordCommand } from "./necord.command";',
			content: `import { NecordCommand } from "./necord.command";
import { NecordPagination } from "./necord.pagination";`
		},
		providers: {
			replacer: "providers: [NecordService, NecordCommand]",
			content: "providers: [NecordService, NecordCommand, NecordPagination]"
		}
	};
}

export const necordPaginationCommandUpdates = {
	addCommand: {
		replacer: 'return interaction.reply({ content: "Pong!" });',
		content: `return interaction.reply({ content: "Pong!" });
  }

  @SlashCommand({ name: "pagination", description: "Test pagination" })
  public async onPagination(@Context() [interaction]: SlashCommandContext) {
    const pagination = this.paginationService.get("test");
    const page = await pagination.build();

    return interaction.reply(page);`
	},
	addImport: {
		replacer: 'import { Context, SlashCommand, SlashCommandContext } from "necord";',
		content: `import { Context, SlashCommand, SlashCommandContext } from "necord";
import { NecordPaginationService } from "@necord/pagination";`
	},
	addConstructor: {
		replacer: "export class NecordCommand {",
		content: `export class NecordCommand {
  public constructor(private readonly paginationService: NecordPaginationService) {}`
	}
};
