import { NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";
import { configConstants } from "../config/constant.template";
import { configTemplates } from "../config/index";
import { configMainTemplates } from "../config/main.template";

export const modulesTemplates = [
	{
		name: "config",
		templates: configTemplates,
		constants: configConstants,
		mainTemplates: configMainTemplates,
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
	}
];
