import { DEV_NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";
import type { ModuleTemplate } from "../../../generators/module.service";
import { JestConfigTemplates } from "./config.template";
import { jestScripts } from "./scripts.template";

export const JestTemplates: ModuleTemplate = {
	name: "jest",
	templates: [JestConfigTemplates],
	packages: [
		{
			...DEV_NPM_DEPENDENCIES["@nestjs/testing"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["jest"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["@types/jest"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["supertest"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["@types/supertest"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["ts-jest"],
			dev: true
		}
	],
	scripts: jestScripts
};
