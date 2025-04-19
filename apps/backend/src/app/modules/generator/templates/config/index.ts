import { dotenvTemplate } from "./dotenv.template";
import { envDtoTemplate } from "./env-dto.template";
import { envTypesTemplate } from "./index-d.template";
import { configModuleTemplate } from "./module.template";
import { configServiceTemplate } from "./service.template";
import { configValidatorTemplate } from "./validator.template";

export const configTemplates = [
	envDtoTemplate,
	envTypesTemplate,
	dotenvTemplate,
	configModuleTemplate,
	configServiceTemplate,
	configValidatorTemplate
];
