import { appControllerTemplate } from "../templates/app/controller.template";
import { appModuleTemplate } from "../templates/app/module.template";
import { appServiceTemplate } from "../templates/app/service.template";
import { BaseGenerator } from "./base.generator";

export function AppGenerator(id: string) {
	BaseGenerator(id, "app.module.ts", appModuleTemplate, false, "src");
	BaseGenerator(id, "app.controller.ts", appControllerTemplate, false, "src");
	BaseGenerator(id, "app.service.ts", appServiceTemplate, false, "src");
}
