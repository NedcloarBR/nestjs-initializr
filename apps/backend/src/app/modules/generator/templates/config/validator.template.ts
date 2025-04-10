const content = `
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

function validateConfig<T extends object>(
  config: Record<string, unknown>,
  dtoClass: ClassConstructor<T>,
) {
  const validatedConfig = plainToClass(dtoClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export default validateConfig;
`;

export const configValidatorTemplate = {
	name: "config.validator.ts",
	path: "src/modules/config",
	content
};
