import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { ConfigDTO } from "./config.dto";

export function configValidator(config: Record<string, string | number | boolean | undefined>): ConfigDTO {
	const validatedConfig = plainToInstance(ConfigDTO, config, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
		forbidUnknownValues: true,
	});

	if (errors.length > 0) {
		throw new Error(`${errors.map((err) => JSON.stringify(err.constraints)).join(", ")}`);
	}

	return validatedConfig;
}
