export const envDtoTemplate = {
	name: "localization-env.dto.ts",
	path: "src/modules/necord/dtos",
	content: `
    import { registerAs } from "@nestjs/config";
    import { IsString, IsNotEmpty } from "class-validator";
    import validateConfig from "@/modules/config/config.validator";

    export class LocalizationEnvDTO {
      @IsString()
      @IsNotEmpty()
      public readonly DISCORD_FALLBACK_LOCALE!: string;
    }

    export default registerAs("localization_env", () => {
      validateConfig(process.env, LocalizationEnvDTO);

      return {
        DISCORD_FALLBACK_LOCALE: process.env.DISCORD_FALLBACK_LOCALE || "",
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
			content:
				'import EnvConfig from "./dtos/env.dto"\nimport LocalizationEnvConfig from "@/modules/necord/dtos/localization-env.dto"'
		},
		{
			replacer: "load: [EnvConfig",
			content: "load: [EnvConfig, LocalizationEnvConfig"
		}
	]
};
