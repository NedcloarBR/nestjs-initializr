import { NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";
import type { ModuleTemplate } from "../../generators/module.service";
import { NestWhatsConstants } from "./constants.template";
import { NestWhatsModuleTemplate } from "./module.template";
import { NestWhatsServiceTemplate } from "./service.template";

export const NestWhatsTemplates: ModuleTemplate = {
	name: "nestwhats",
	templates: [NestWhatsModuleTemplate, NestWhatsServiceTemplate],
	constants: NestWhatsConstants,
	packages: [
		{
			...NPM_DEPENDENCIES["nestwhats"],
			dev: false
		},
		{
			...NPM_DEPENDENCIES["whatsapp-web.js"],
			dev: false
		}
	]
};
