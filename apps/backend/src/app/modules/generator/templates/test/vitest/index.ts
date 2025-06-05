import { DEV_NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";
import type { ModuleTemplate } from "../../../generators/module.service";
import { VitestConfigTemplates } from "./config.template";
import { vitestScripts } from "./scripts.template";

export const VitestTemplates: ModuleTemplate = {
	name: "vitest",
	templates: [VitestConfigTemplates],
	packages: [
		{
			...DEV_NPM_DEPENDENCIES["@nestjs/testing"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["vitest"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["vite-tsconfig-paths"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["@vitest/ui"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["@vitest/coverage-v8"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["supertest"],
			dev: true
		},
		{
			...DEV_NPM_DEPENDENCIES["@types/supertest"],
			dev: true
		}
	],
	scripts: vitestScripts
};
