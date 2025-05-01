import { NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";
import type { ModuleTemplate } from "../../../generators/module.service";
import { applicationYmlTemplate } from "./application-yml.template";
import { configTemplate } from "./config.template";
import { dockerComposeTemplate } from "./docker-compose.template";
import { dockerFileTemplate } from "./docker-file.template";
import { envDtoTemplate, updateConfigModuleTemplate } from "./env-dto.template";
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
			...(withConfigModule ? [configTemplate, updateConfigModuleTemplate] : []),
			NecordLavalinkModuleTemplate(withConfigModule)
		],
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
