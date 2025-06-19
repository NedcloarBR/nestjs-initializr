import { NPM_DEPENDENCIES } from "@/app/constants/packages";
import type { ModuleTemplate } from "@/types";
import { applicationYmlTemplate } from "./application-yml.template";
import { configServiceTemplate } from "./config-service.template";
import { configTemplate } from "./config.template";
import { NecordLavalinkConstants } from "./constants.template";
import { dockerComposeTemplate } from "./docker-compose.template";
import { dockerFileTemplate } from "./docker-file.template";
import { envDtoTemplate, updateConfigModuleTemplate } from "./env-dto.template";
import { indexDTemplate } from "./index-d.template";
import { ListenersTemplate } from "./listeners.template";
import { NecordLavalinkModuleTemplate } from "./module.template";
import { playTemplate } from "./play-command.template";
import { queryDtoTemplate } from "./query-dto.template";
import { sourceAutocompleteTemplate } from "./source-autocomplete.template";

export function NecordLavalinkTemplates(withConfigModule: boolean): ModuleTemplate {
	return {
		name: "necord-lavalink",
		templates: [
			...(withConfigModule ? [envDtoTemplate] : []),
			ListenersTemplate,
			playTemplate,
			queryDtoTemplate,
			sourceAutocompleteTemplate,
			dockerComposeTemplate,
			dockerFileTemplate,
			applicationYmlTemplate,
			playTemplate,
			queryDtoTemplate,
			sourceAutocompleteTemplate
		],
		filesToUpdate: [
			...(withConfigModule ? [configTemplate, updateConfigModuleTemplate, configServiceTemplate, indexDTemplate] : []),
			NecordLavalinkModuleTemplate(withConfigModule)
		],
		constants: NecordLavalinkConstants,
		packages: [
			{
				...NPM_DEPENDENCIES["@necord/lavalink"],
				dev: false
			},
			{
				...NPM_DEPENDENCIES["lavalink-client"],
				dev: false
			}
		]
	};
}
