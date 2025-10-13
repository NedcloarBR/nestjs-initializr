import { NPM_DEPENDENCIES } from "@/app/constants/packages";
import type { ModuleTemplate } from "@/types";
import { NestjsToolkitConstants } from "./constants.template";
import { NestjsToolkitMainTemplate } from "./main.template";

export function NestjsToolkitTemplates(withConfigModule: boolean): ModuleTemplate {
	return {
		name: "nestjs-toolkit",
		templates: [],
		mainTemplates: NestjsToolkitMainTemplate(withConfigModule),
		constants: NestjsToolkitConstants,
		packages: [
			{
				...NPM_DEPENDENCIES["@nedcloarbr/nestjs-toolkit"],
				dev: false
			}
		]
	};
}
