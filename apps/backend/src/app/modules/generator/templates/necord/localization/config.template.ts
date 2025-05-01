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
            intents: [IntentsBitField.Flags.Guilds]
          }
        }
      `,
			content: `
        public createNecordOptions(): NecordModuleConfig {
          return {
            token: this.config.get("DISCORD_TOKEN"),
            intents: [IntentsBitField.Flags.Guilds]
          }
        }\n
        public async createNecordLocalizationOptions(): <NecordLocalizationOptions> {
          return {
            adapter: new NestedLocalizationAdapter({
				      fallbackLocale: this.config.get("DISCORD_FALLBACK_LOCALE"),
				      locales: await new JSONLocaleLoader(
					      "./src/common/localization/necord/",
				      ).loadTranslations(),
			      }),
			      resolvers: GuildResolver,
		      };
        }
      `
		}
	]
};
