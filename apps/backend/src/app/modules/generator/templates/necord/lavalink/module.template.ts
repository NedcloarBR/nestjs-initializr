export function NecordLavalinkModuleTemplate(withConfigModule: boolean) {
	return {
		path: "src/modules/necord",
		name: "necord.module.ts",
		templates: [
			{
				replacer: 'import { NecordModule as NecordModuleCore } from "necord";',
				content:
					'import { NecordModule as NecordModuleCore } from "necord";\nimport { NecordLavalinkModule } from "@necord/lavalink";'
			},
			withConfigModule
				? null
				: {
						replacer: "IntentsBitField.Flags.MessageContent",
						content: "IntentsBitField.Flags.MessageContent,\nIntentsBitField.Flags.GuildVoiceStates"
					},
			{
				replacer: "],",
				content: `,\nNecordLavalinkModule.${
					withConfigModule
						? `forRootAsync({
                inject: [ConfigService],
                useClass: NecordConfig
              })\n],`
						: `forRoot({
                nodes: [
                  {
                    authorization: "youshallnotpass",
                    host: "localhost",
                    port: 2333
                  }
                ]
              })\n],`
				}
        `
			},
			{
				replacer: 'import { NecordLavalinkModule } from "@necord/lavalink"',
				content:
					'import { NecordLavalinkModule } from "@necord/lavalink";\nimport { PlayCommand } from "./commands/play/play.command";'
			},
			{
				replacer: "providers: [NecordService,",
				content: "providers: [NecordService, PlayCommand,"
			}
		]
	};
}
