export const configTemplate = {
	path: "src/modules/necord",
	name: "necord.config.ts",
	templates: [
		{
			replacer: 'import type { NecordModuleOptions } from "necord";',
			content:
				'import type { NecordModuleOptions } from "necord";\nimport { GuildResolver, type NecordLocalizationOptions, NestedLocalizationAdapter } from "@necord/localization";\nimport { JSONLocaleLoader } from "./JSONLocale.loader";'
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

        public async createNecordLocalizationOptions(): NecordLocalizationOptions {
          return {
            adapter: new NestedLocalizationAdapter({
				      fallbackLocale: this.config.get("DISCORD_FALLBACK_LOCALE"),
				      locales: await new JSONLocaleLoader(
					      "./src/common/localization/necord/",
				      ).loadTranslations(),
			      }),
			      resolvers: GuildResolver
		      };
        }
      `
		}
	]
};
