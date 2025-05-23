export function moduleTemplate(withConfigModule: boolean) {
	return {
		path: "src/modules/necord",
		name: "necord.module.ts",
		templates: [
			{
				replacer: 'import { NecordModule as NecordModuleCore } from "necord";',
				content:
					'import { NecordModule as NecordModuleCore } from "necord";\nimport { GuildResolver, NecordLocalizationModule, NestedLocalizationAdapter } from "@necord/localization";'
			},
			{
				replacer: 'import { NecordCommand } from "./necord.command";',
				content:
					'import { NecordCommand } from "./necord.command";\nimport { NecordPagination } from "./necord.pagination";'
			},
			{
				replacer: "],",
				content: `,\nNecordLocalizationModule.${
					withConfigModule
						? `forRootAsync({
                inject: [ConfigService],
                useClass: NecordConfig
              })\n],`
						: `forRoot({
                resolvers: GuildResolver,
                adapter: new NestedLocalizationAdapter({
                  fallbackLanguage: "en-US",
                  locales: {
                    "en-US": {
                      "commands": {
                        "ping": {
                          name: "ping",
                          description: "Pong!"
                        }
                      }
                    }
                  }
                })
              })\n],`
				}`
			}
		]
	};
}
