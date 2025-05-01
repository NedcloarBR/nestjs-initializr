export const configTemplate = {
	path: "src/modules/necord",
	name: "necord.config.ts",
	templates: [
		{
			replacer: 'import type { NecordModuleOptions } from "necord";',
			content:
				'import type { NecordModuleOptions } from "necord";\nimport type { NecordLavalinkModuleOptions } from "@necord/localization";'
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
        public async createNecordLavalinkOptions(): <NecordLavalinkOptions> {
          return {
            nodes: [
              {
                authorization: this.config.get("LAVALINK_AUTHORIZATION"),
                host: this.config.get("LAVALINK_HOST"),
                port: this.config.get("LAVALINK_PORT"),
              }
            ]
		      };
        }
      `
		}
	]
};
