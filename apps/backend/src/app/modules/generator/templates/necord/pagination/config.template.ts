export const configTemplate = {
	path: "src/modules/necord",
	name: "necord.config.ts",
	templates: [
		{
			replacer: 'import type { NecordModuleOptions } from "necord";',
			content:
				'import type { NecordModuleOptions } from "necord";\nimport type { NecordPaginationOptions } from "@necord/pagination";'
		},
		{
			replacer: `
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
      `,
			content: `
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

        public createNecordPaginationOptions(): NecordPaginationOptions {
          return {
            allowSkip: false,
            allowTraversal: false,
            buttonsPostion: "end"
          };
        }
      `
		}
	]
};
