import type { StaticTemplate } from "@/types";

export const configModuleTemplate: StaticTemplate = {
	name: "config.module.ts",
	path: "src/modules/config",
	content: `
import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { ConfigService } from "./config.service";
import EnvConfig from "./dtos/env.dto";
import { Services } from "../../constants/services";

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [EnvConfig]
    })
  ],
  providers: [
    {
      provide: Services.Config,
      useClass: ConfigService,
    }
  ],
  exports: [Services.Config],
})
export class ConfigModule {}
`.trim()
};

export const configServiceTemplate: StaticTemplate = {
	name: "config.service.ts",
	path: "src/modules/config",
	content: `
import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { EnvDTO } from "./dtos/env.dto";

export type ConfigSchema = InstanceType<typeof EnvDTO>;

@Injectable()
export class ConfigService {
  public constructor(
    private readonly nestConfigService: NestConfigService<ConfigSchema>
  ) {}

  public get<K extends keyof ConfigSchema>(value: K): ConfigSchema[K] {
    return this.nestConfigService.get<ConfigSchema[K]>(value);
  }
}
`.trim()
};

export const configValidatorTemplate: StaticTemplate = {
	name: "config.validator.ts",
	path: "src/modules/config",
	content: `
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { ClassConstructor } from "class-transformer/types/interfaces";

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
`.trim()
};

export const envDtoTemplate: StaticTemplate = {
	name: "env.dto.ts",
	path: "src/modules/config/dtos",
	content: `
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
`.trim()
};

export const envTypesTemplate: StaticTemplate = {
	name: "index.d.ts",
	path: "src/types",
	content: `
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    PORT: number;
    GLOBAL_PREFIX: string;
  }
}
`.trim()
};

export const configTemplates: StaticTemplate[] = [
	configModuleTemplate,
	configServiceTemplate,
	configValidatorTemplate,
	envDtoTemplate,
	envTypesTemplate
];
