export const envDtoTemplate = {
	name: "lavalink-env.dto.ts",
	path: "src/modules/necord/dtos",
	content: `
    import { registerAs } from "@nestjs/config";
    import {
      IsNumber,
      IsString,
      IsNotEmpty,
      Min,
      Max,
    } from "class-validator";
    import validateConfig from "@/modules/config/config.validator";

    export class LavalinkEnvDTO {
      @IsString()
      @IsNotEmpty()
      public readonly LAVALINK_AUTHORIZATION!: string;

      @IsString()
      @IsNotEmpty()
      public readonly LAVALINK_HOST!: string;

      @IsNumber()
      @Min(0)
    	@Max(65535)
      @IsNotEmpty()
      public readonly LAVALINK_PORT!: number;
    }

    export default registerAs("lavalink_env", () => {
      validateConfig(process.env, LavalinkEnvDTO);

      return {
        LAVALINK_AUTHORIZATION: process.env.LAVALINK_AUTHORIZATION || "",
        LAVALINK_HOST: process.env.LAVALINK_HOST || "",
        LAVALINK_PORT: parseInt(process.env.LAVALINK_PORT) || 0
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
				'import EnvConfig from "./dtos/env.dto"\nimport LavalinkEnvConfig from "@/modules/necord/dtos/lavalink-env.dto.ts"'
		},
		{
			replacer: "load: [EnvConfig",
			content: "load: [EnvConfig, LavalinkEnvConfig"
		}
	]
};
