import { IsBoolean, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
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

	@IsBoolean()
	public readonly SOCKET_ADMIN_ENABLED: boolean;

	@IsString()
	@ValidateIf((data: ConfigDTO) => data.SOCKET_ADMIN_ENABLED)
	public readonly SOCKET_ADMIN_USERNAME: string;

	@IsString()
	@ValidateIf((data: ConfigDTO) => data.SOCKET_ADMIN_ENABLED)
	public readonly SOCKET_ADMIN_PASSWORD: string;

	@IsString()
	@IsOptional()
	public readonly NODE_ENV?: NodeEnv;
}
