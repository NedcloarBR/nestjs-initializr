import { IsNumber, IsOptional, IsString } from "class-validator";
import type { NodeEnv } from "@/app/constants/environment";

export class ConfigDTO {
	@IsString()
	public readonly CORS_ORIGIN: string;

	@IsNumber(
		{
			allowInfinity: false,
			allowNaN: false
		},
		{
			message: "PORT must be a number"
		}
	)
	public readonly PORT: number;

	@IsString({
		message: "GLOBAL_PREFIX must be a string"
	})
	public readonly GLOBAL_PREFIX: string;

	@IsString()
	@IsOptional()
	public readonly NODE_ENV?: NodeEnv;
}
