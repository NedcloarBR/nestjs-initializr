import { NPM_DEPENDENCIES } from "@/app/constants/packages";
import type { ModuleTemplate } from "@/types";
import { commandTemplate } from "./command.template";
import { configTemplate } from "./config.template";
import { NecordLocalizationConstants } from "./constants.template";
import { dotenvTemplate } from "./dotenv.template";
import { envDtoTemplate, updateConfigModuleTemplate } from "./env-dto.template";
import { JSONLocaleLoaderTemplate } from "./jsonlocale-loader.template";
import { moduleTemplate } from "./module.template";
import { pingTranslationTemplate } from "./ping-translation.template";

export function NecordLocalizationTemplates(withConfigModule: boolean): ModuleTemplate {
	return {
		name: "necord-localization",
		templates: [...(withConfigModule ? [JSONLocaleLoaderTemplate, pingTranslationTemplate, envDtoTemplate] : [])],
		filesToUpdate: [
			commandTemplate,
			moduleTemplate(withConfigModule),
			...(withConfigModule ? [configTemplate, updateConfigModuleTemplate] : []),
			dotenvTemplate
		],
		constants: NecordLocalizationConstants,
		packages: [
			{
				...NPM_DEPENDENCIES["@necord/localization"],
				dev: false
			}
		]
	};
}
