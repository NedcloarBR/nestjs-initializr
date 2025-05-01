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
        public createNecordPaginationOptions(): NecordPaginationOptions {
          return {
            allowSkip: false,
            allowTraversal: false,
            buttonsPostion: "end"
          }
        }
      `
		}
	]
};
