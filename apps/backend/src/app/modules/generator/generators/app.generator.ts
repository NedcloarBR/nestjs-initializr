import { BaseGenerator } from ".";
import { appControllerTemplate, appModuleTemplate, appServiceTemplate } from "../templates";

export function AppGenerator(id: string) {
	BaseGenerator(id, appModuleTemplate);
	BaseGenerator(id, appControllerTemplate);
	BaseGenerator(id, appServiceTemplate);
}
