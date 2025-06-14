import { NPM_DEPENDENCIES } from "@/app/constants/packages";
import type { ModuleTemplate } from "@/types";
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
