import { appControllerTemplate } from "../templates/app/controller.template";
import { appModuleTemplate } from "../templates/app/module.template";
import { appServiceTemplate } from "../templates/app/service.template";
import { BaseGenerator } from "./base.generator";

export function AppGenerator(id: string) {
	BaseGenerator(id, appModuleTemplate);
	BaseGenerator(id, appControllerTemplate);
	BaseGenerator(id, appServiceTemplate);
}
