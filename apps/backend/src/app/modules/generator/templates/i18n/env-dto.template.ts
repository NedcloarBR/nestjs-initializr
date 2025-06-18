export const envDtoTemplate = {
	name: "i18n-env.dto.ts",
	path: "src/modules/i18n/dtos",
	content: `
    import { registerAs } from "@nestjs/config";
    import { IsString, IsNotEmpty } from "class-validator";
    import validateConfig from "@/modules/config/config.validator";

    export class I18nEnvDTO {
      @IsString()
      @IsNotEmpty()
      public readonly I18N_FALLBACK_LANGUAGE!: string;
    }

    export default registerAs("i18n_env", () => {
      validateConfig(process.env, I18nEnvDTO);

      return {
        I18N_FALLBACK_LANGUAGE: process.env.I18N_FALLBACK_LANGUAGE || "en-US",
      };
    });
  `
};

export const updateConfigModuleTemplate = {
	path: "src/modules/config",
	name: "config.module.ts",
	templates: [
		{
			replacer: 'import EnvConfig from "./dtos/env.dto"',
			content: 'import EnvConfig from "./dtos/env.dto"\nimport I18nEnvDTO from "@/modules/i18n/dtos/i18n-env.dto"'
		},
		{
			replacer: "load: [EnvConfig",
			content: "load: [EnvConfig, I18nEnvDTO"
		}
	]
};
