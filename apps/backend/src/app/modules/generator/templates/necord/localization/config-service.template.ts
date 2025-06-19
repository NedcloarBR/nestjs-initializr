export const configServiceTemplate = {
	name: "config.service.ts",
	path: "src/modules/config",
	templates: [
		{
			replacer: 'import { EnvDTO } from "./dtos/env.dto";',
			content:
				'import { EnvDTO } from "./dtos/env.dto";\nimport { LocalizationEnvDTO } from "@/modules/necord/dtos/localization-env.dto"'
		},
		{
			replacer: "InstanceType<typeof EnvDTO>",
			content: "InstanceType<typeof EnvDTO> & InstanceType<typeof LocalizationEnvDTO>"
		}
	]
};
