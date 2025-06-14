import { NPM_DEPENDENCIES } from "@/app/constants/packages";
import type { ModuleTemplate } from "@/types";
import { configConstants } from "./constant.template";
import { dotenvTemplate } from "./dotenv.template";
import { envDtoTemplate } from "./env-dto.template";
import { envTypesTemplate } from "./index-d.template";
import { configMainTemplates } from "./main.template";
import { configModuleTemplate } from "./module.template";
import { configServiceTemplate } from "./service.template";
import { configValidatorTemplate } from "./validator.template";

export function ConfigTemplates(mainType: "fastify" | "express"): ModuleTemplate {
	return {
		name: "config",
		templates: [envDtoTemplate, envTypesTemplate, configModuleTemplate, configServiceTemplate, configValidatorTemplate],
		filesToUpdate: [dotenvTemplate],
		constants: configConstants,
		mainTemplates: configMainTemplates(mainType),
		packages: [
			{
				...NPM_DEPENDENCIES["@nestjs/config"],
				dev: false
			},
			{
				...NPM_DEPENDENCIES["class-validator"],
				dev: false
			},
			{
				...NPM_DEPENDENCIES["class-transformer"],
				dev: false
			}
		]
	};
}
