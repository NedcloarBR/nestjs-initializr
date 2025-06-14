import { NPM_DEPENDENCIES } from "@/app/constants/packages";
import type { ModuleTemplate } from "@/types";
import { NecordCommandTemplate } from "./command.template";
import { NecordConfigTemplate } from "./config.template";
import { NecordConstants } from "./constants.template";
import { dotenvTemplate } from "./dotenv.template";
import { envDtoTemplate, updateConfigModuleTemplate } from "./env-dto.template";
import { NecordModuleTemplate } from "./module.template";
import { NecordServiceTemplate } from "./service.template";

export function NecordTemplates(withConfigModule: boolean): ModuleTemplate {
	return {
		name: "necord",
		templates: [
			NecordModuleTemplate(withConfigModule),
			NecordServiceTemplate,
			NecordCommandTemplate,
			...(withConfigModule ? [NecordConfigTemplate, envDtoTemplate] : [])
		],
		filesToUpdate: [dotenvTemplate, ...(withConfigModule ? [updateConfigModuleTemplate] : [])],
		constants: NecordConstants,
		packages: [
			{
				...NPM_DEPENDENCIES["necord"],
				dev: false
			},
			{
				...NPM_DEPENDENCIES["discord.js"],
				dev: false
			}
		]
	};
}
