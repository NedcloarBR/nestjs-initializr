export const configServiceTemplate = {
	name: "config.service.ts",
	path: "src/modules/config",
	templates: [
		{
			replacer: 'import { EnvDTO } from "./dtos/env.dto";',
			content: 'import { EnvDTO } from "./dtos/env.dto";\nimport { I18nEnvDTO } from "@/modules/i18n/dtos/i18n-env.dto"'
		},
		{
			replacer: "InstanceType<typeof EnvDTO>",
			content: "InstanceType<typeof EnvDTO> & InstanceType<typeof I18nEnvDTO>"
		}
	]
};
