export const envDtoTemplate = {
	name: "discord-env.dto.ts",
	path: "src/modules/necord/dtos",
	content: `
    import { registerAs } from "@nestjs/config";
    import { IsString, IsNotEmpty } from "class-validator";
    import validateConfig from "@/modules/config/config.validator";

    export class DiscordEnvDTO {
      @IsString()
      @IsNotEmpty()
      public readonly DISCORD_TOKEN!: string;

      @IsString()
      @IsNotEmpty()
      public readonly DISCORD_DEVELOPMENT_GUILD_ID!: string[];
    }

    export default registerAs("discord_env", () => {
      validateConfig(process.env, DiscordEnvDTO);

      return {
        DISCORD_TOKEN: process.env.DISCORD_TOKEN || "",
        DISCORD_DEVELOPMENT_GUILD_ID: [process.env.DISCORD_DEVELOPMENT_GUILD_ID]
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
				'import EnvConfig from "./dtos/env.dto"\nimport DiscordEnvConfig from "@/modules/necord/dtos/discord-env.dto"'
		},
		{
			replacer: "load: [EnvConfig",
			content: "load: [EnvConfig, DiscordEnvConfig"
		}
	]
};
