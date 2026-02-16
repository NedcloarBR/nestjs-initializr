/**
 * Necord Pagination templates - Paginated embeds for Discord bots
 */

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
			replacer: "providers: [NecordService, NecordCommand",
			content: "providers: [NecordService, NecordCommand, NecordPagination"
		},
		moduleConfig: {
			content: withConfigModule
				? `
    NecordPaginationModule.forRootAsync({
      inject: [Services.Config],
      useClass: NecordConfig
    })`
				: `
    NecordPaginationModule.forRoot({
      allowSkip: false,
			allowTraversal: false,
			buttonsPosition: "end",
    })`
		}
	};
}

export const necordPaginationCommandUpdates = {
	addCommand: {
		replacer: "//MoreOptions?",
		content: `
  @SlashCommand({ name: "pagination", description: "Test pagination" })
  public async onPagination(@Context() [interaction]: SlashCommandContext) {
    const pagination = this.paginationService.get("test");
    const page = await pagination.build();

    return interaction.reply(page);
  }
    //MoreOptions?`
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

export const necordPaginationConfigIntegration = {
	importString: {
		path: "src/modules/necord",
		name: "necord.config.ts",
		replacer: 'import { NecordModule } from "necord";',
		content:
			'import { NecordModule } from "necord";\nimport type { NecordPaginationOptions } from "@necord/pagination";'
	},
	configFunction: {
		path: "src/modules/necord",
		name: "necord.config.ts",
		replacer: "// MoreOptions?",
		content: `
    public createNecordPaginationOptions(): NecordPaginationOptions {
		return {
			allowSkip: false,
			allowTraversal: false,
			buttonsPosition: "end",
		};
	}

  // MoreOptions?
    `
	}
};
