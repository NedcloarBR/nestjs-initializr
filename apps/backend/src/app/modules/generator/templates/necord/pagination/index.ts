import { NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";
import type { ModuleTemplate } from "../../../generators/module.service";
import { commandTemplate } from "./command.template";
import { configTemplate } from "./config.template";
import { NecordPaginationConstants } from "./constants.template";
import { moduleTemplate } from "./module.template";
import { paginationTemplate } from "./pagination.template";

export function NecordPaginationTemplates(withConfigModule: boolean): ModuleTemplate {
	return {
		name: "necord-pagination",
		templates: [paginationTemplate],
		filesToUpdate: [moduleTemplate(withConfigModule), ...(withConfigModule ? [configTemplate] : []), commandTemplate],
		constants: NecordPaginationConstants,
		packages: [
			{
				...NPM_DEPENDENCIES["@necord/pagination"],
				dev: false
			}
		]
	};
}
