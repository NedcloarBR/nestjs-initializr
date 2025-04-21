const content = `
import { registerAs } from "@nestjs/config";
import {
	IsNumber,
	IsString,
	IsNotEmpty,
	IsOptional,
	IsEnum,
	Min,
	Max,
} from "class-validator";
import validateConfig from "../config.validator";

enum Environment {
	Development = "development",
	Production = "production",
	Test = "test",
}

export class EnvDTO {
	@IsEnum(Environment)
	@IsOptional()
	public readonly NODE_ENV?: Environment;

	@IsNumber()
	@Min(0)
	@Max(65535)
	@IsNotEmpty()
	public readonly PORT!: number;

	@IsString()
	@IsNotEmpty()
	public readonly GLOBAL_PREFIX!: string;
}

export default registerAs("env", () => {
  validateConfig(process.env, EnvDTO);

  return {
	  NODE_ENV: process.env.NODE_ENV as Environment || Environment.Development,
	  PORT: Number(process.env.PORT),
	  GLOBAL_PREFIX: process.env.GLOBAL_PREFIX || "",
  };
});

`;

export const envDtoTemplate = {
	name: "env.dto.ts",
	path: "src/modules/config/dtos",
	content
};
