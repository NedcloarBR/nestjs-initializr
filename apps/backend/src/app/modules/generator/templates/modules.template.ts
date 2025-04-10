import { configConstants } from "./config/constant.template";
import { configTemplates } from "./config/index";

export const modulesTemplates = [
	{
		name: "config",
		templates: configTemplates,
		constants: configConstants
	}
];
