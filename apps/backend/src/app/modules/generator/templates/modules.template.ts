import { configConstants } from "./config/constant.template";
import { configTemplates } from "./config/index";
import { configMainTemplates } from "./config/main.template";

export const modulesTemplates = [
  {
    name: "config",
    templates: configTemplates,
    constants: configConstants,
    mainTemplates: configMainTemplates
  }
];
