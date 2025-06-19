export function NecordModuleTemplate(withConfigModule: boolean) {
	return {
		name: "necord.module.ts",
		path: "src/modules/necord",
		content: `
      import { Module } from "@nestjs/common";
      ${withConfigModule ? 'import { Services } from "@/constants/services";' : ""}
      import { NecordModule as NecordModuleCore } from "necord";
      import { NecordService } from "./necord.service";
      import { NecordCommand } from "./necord.command";
      ${withConfigModule ? 'import { NecordConfig } from "./necord.config";' : ""}
      ${withConfigModule ? "" : "import { IntentsBitField } from 'discord.js';"}

      @Module({
        imports: [
          NecordModuleCore.${
						withConfigModule
							? `forRootAsync({
                  inject: [Services.Config],
                  useClass: NecordConfig
                })`
							: `forRoot({
                  token: process.env.DISCORD_TOKEN,
                  intents: [
                    IntentsBitField.Flags.Guilds,
                    IntentsBitField.Flags.DirectMessages,
                    IntentsBitField.Flags.GuildMembers,
                    IntentsBitField.Flags.GuildMessages,
                    IntentsBitField.Flags.MessageContent
                  ],
                  development: process.env.DISCORD_DEVELOPMENT_GUILD_ID
              })`
					}
        ],
        providers: [NecordService, NecordCommand]
      })
      export class NecordModule {}
    `
	};
}
