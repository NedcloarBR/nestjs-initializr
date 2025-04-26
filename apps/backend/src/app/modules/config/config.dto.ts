import { IsNumber, IsString } from "class-validator";

export class ConfigDTO {
	@IsString()
	public readonly BACKEND_CORS_ORIGIN: string;

	@IsNumber(
		{
			allowInfinity: false,
			allowNaN: false
		},
		{
			message: "BACKEND_PORT must be a number"
		}
	)
	public readonly BACKEND_PORT: number;

	@IsString({
		message: "BACKEND_GLOBAL_PREFIX must be a string"
	})
	public readonly BACKEND_GLOBAL_PREFIX: string;
}
