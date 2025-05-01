export const paginationTemplate = {
	name: "necord.pagination.ts",
	path: "src/modules/necord",
	content: `
    import { OnModuleInit, Injectable } from "@nestjs/common";
    import { NecordPaginationService, PageBuilder } from "@necord/pagination";
    import { Context, SlashCommand, SlashCommandContext } from "necord";

    @Injectable()
    export class NecordPagination implements OnModuleInit {
      public constructor(private readonly paginationService: NecordPaginationService) {
      }
      public onModuleInit(): void {
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
            .setPagesFactory(page => new PageBuilder().setContent(\`Page\$ {page}\`))
            .setMaxPages(5)
        );
      }
    }
  `
};
