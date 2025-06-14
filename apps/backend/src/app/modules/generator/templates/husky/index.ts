import { DEV_NPM_DEPENDENCIES } from "@/app/constants/packages";
import type { ModuleTemplate } from "@/types";
import type { MetadataDTO } from "../../dtos/metadata.dto";
import { HuskyConfigsTemplates } from "./configs.template";
import { HuskyConstants } from "./constants.template";
import { HuskyHooksTemplates } from "./hooks.template";

export function HuskyTemplates(
	packageManager: MetadataDTO["packageManager"],
	linterFormatter: MetadataDTO["linterFormatter"]
): ModuleTemplate {
	return {
		name: "husky",
		constants: HuskyConstants,
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
