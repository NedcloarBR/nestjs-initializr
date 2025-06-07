export function moduleTemplate(withConfigModule: boolean) {
	return {
		path: "src/modules/necord",
		name: "necord.module.ts",
		templates: [
			{
				replacer: 'import { NecordModule as NecordModuleCore } from "necord";',
				content: `import { NecordModule as NecordModuleCore } from "necord";\nimport { ${withConfigModule ? "" : "GuildResolver,"} NecordLocalizationModule ${withConfigModule ? "" : ", NestedLocalizationAdapter"} } from "@necord/localization";`
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
