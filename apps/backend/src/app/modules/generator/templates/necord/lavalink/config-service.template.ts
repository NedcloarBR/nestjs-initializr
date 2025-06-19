export const configServiceTemplate = {
	name: "config.service.ts",
	path: "src/modules/config",
	templates: [
		{
			replacer: 'import { EnvDTO } from "./dtos/env.dto";',
			content:
				'import { EnvDTO } from "./dtos/env.dto";\nimport { DiscordEnvDTO } from "@/modules/necord/dtos/lavalink-env.dto"'
		},
		{
			replacer: "InstanceType<typeof EnvDTO>",
			content: "InstanceType<typeof EnvDTO> & InstanceType<typeof LavalinkEnvDTO>"
		}
	]
};
