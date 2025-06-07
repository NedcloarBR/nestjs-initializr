export function moduleTemplate(withConfigModule: boolean) {
	return {
		path: "src/modules/necord",
		name: "necord.module.ts",
		templates: [
			{
				replacer: 'import { NecordModule as NecordModuleCore } from "necord";',
				content:
					'import { NecordModule as NecordModuleCore } from "necord";\nimport { NecordPaginationModule } from "@necord/pagination";'
			},
			{
				replacer: 'import { NecordCommand } from "./necord.command";',
				content:
					'import { NecordCommand } from "./necord.command";\nimport { NecordPagination } from "./necord.pagination";'
			},
			{
				replacer: "],",
				content: `,\nNecordPaginationModule.${
					withConfigModule
						? `forRootAsync({
                useClass: NecordConfig
              })\n],`
						: `forRoot({
                allowSkip: false,
			          allowTraversal: false,
                buttonsPostion: "end"
              })\n],`
				}`
			},
			{
				replacer: ", NecordCommand",
				content: ", NecordCommand, NecordPagination"
			}
		]
	};
}
