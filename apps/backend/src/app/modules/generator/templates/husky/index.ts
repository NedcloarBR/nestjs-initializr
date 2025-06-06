import { DEV_NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";
import type { MetadataDTO } from "../../dtos/metadata.dto";
import type { ModuleTemplate } from "../../generators/module.service";
import { HuskyConfigsTemplates } from "./configs.template";
import { HuskyHooksTemplates } from "./hooks.template";

export function HuskyTemplates(
	packageManager: MetadataDTO["packageManager"],
	linterFormatter: MetadataDTO["linterFormatter"]
): ModuleTemplate {
	return {
		name: "husky",
		templates: [...HuskyHooksTemplates(packageManager), ...HuskyConfigsTemplates(linterFormatter)],
		packages: [
			{
				...DEV_NPM_DEPENDENCIES["husky"],
				dev: true
			},
			{
				...DEV_NPM_DEPENDENCIES["lint-staged"],
				dev: true
			},
			{
				...DEV_NPM_DEPENDENCIES["@commitlint/cli"],
				dev: true
			},
			{
				...DEV_NPM_DEPENDENCIES["@commitlint/config-angular"],
				dev: true
			}
		],
		scripts: [
			{
				name: "prepare",
				command: "husky"
			}
		]
	};
}
