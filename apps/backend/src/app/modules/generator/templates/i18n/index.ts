import { NPM_DEPENDENCIES } from "@/app/constants/packages";
import type { ModuleTemplate } from "@/types";
import { appServiceTemplate } from "./app-service.template";
import { configServiceTemplate } from "./config-service.template";
import { i18nConstants } from "./constants.template";
import { dotenvTemplate } from "./dotenv.template";
import { envDtoTemplate, updateConfigModuleTemplate } from "./env-dto.template";
import { i18nConfigTemplate } from "./i18n-config.template";
import { i18nModuleTemplate } from "./module.template";
import { nestCliJsonTemplate } from "./nest-cli-json.template";
import { translationTemplate } from "./translation.template";

export function Nestjsi18nTemplates(withConfigModule: boolean): ModuleTemplate {
	return {
		name: "nestjs-i18n",
		templates: [
			i18nModuleTemplate(withConfigModule),
			...(withConfigModule ? [i18nConfigTemplate, envDtoTemplate] : []),
			translationTemplate
		],
		filesToUpdate: [
			nestCliJsonTemplate,
			...(withConfigModule ? [updateConfigModuleTemplate, dotenvTemplate, configServiceTemplate] : []),
			appServiceTemplate
		],
		constants: i18nConstants,
		packages: [
			{
				...NPM_DEPENDENCIES["nestjs-i18n"],
				dev: false
			}
		]
	};
}
