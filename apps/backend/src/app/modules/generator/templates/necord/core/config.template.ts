export const NecordConfigTemplate = {
	name: "necord.config.ts",
	path: "src/modules/necord",
	content: `
    import { Injectable, Inject } from "@nestjs/common";
    import { ConfigService } from "@/modules/config/config.service";
    import { Services } from "@/constants/services";
    import type { NecordModuleOptions } from "necord";
    import { IntentsBitField } from 'discord.js';
    @Injectable()
    export class NecordConfig {
      public constructor(@Inject(Services.Config) private config: ConfigService) {}

      public createNecordOptions(): NecordModuleOptions {
        return {
          token: this.config.get("DISCORD_TOKEN"),
          intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.DirectMessages,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent
          ],
          development: this.config.get("DISCORD_DEVELOPMENT_GUILD_ID")
        }
      }
    }
  `
};
