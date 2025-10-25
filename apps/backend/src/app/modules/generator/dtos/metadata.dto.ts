import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from "class-validator";
import type { ExtraNames, ModuleNames } from "@/types";
import { ExtraPackagesDTO } from "./extra-packages.dto";
import { PackageJsonMetadataDTO } from "./package-json-metadata.dto";

export class MetadataDTO {
	@IsString()
	@IsIn(["express", "fastify"], { message: "Main type must be either 'express' or 'fastify'" })
	@ApiProperty({ description: "The main framework type", example: "fastify" })
	public readonly mainType!: "express" | "fastify";

	@ValidateNested()
	@Type(() => PackageJsonMetadataDTO)
	@IsNotEmptyObject()
	@ApiProperty({ description: "The package.json metadata", type: PackageJsonMetadataDTO })
	public readonly packageJson!: PackageJsonMetadataDTO;

	@IsOptional()
	@IsString({ each: true })
	@ApiProperty({ description: "The modules to include", example: ["config", "i18n"] })
	public readonly modules?: ModuleNames[];

	@IsString()
	@IsIn(["npm", "yarn", "pnpm"])
	@ApiProperty({ description: "The package manager to use", example: "yarn" })
	public readonly packageManager!: "npm" | "yarn" | "pnpm";

	@IsOptional()
	@IsString({ each: true })
	@ApiProperty({ description: "The extra options to include", example: ["cors"] })
	public readonly extras?: ExtraNames[];

	@IsOptional()
	@IsString()
	@IsIn(["biome", "eslint-prettier"])
	@ApiProperty({ description: "The linter/formatter to use", example: "biome" })
	public readonly linterFormatter?: "biome" | "eslint-prettier";

	@IsOptional()
	@IsBoolean()
	@ApiProperty({ description: "Whether to use Docker", example: true })
	public readonly docker?: boolean;

	@IsOptional()
	@IsString()
	@IsIn(["jest", "vitest"])
	@ApiProperty({ description: "The test runner to use", example: "vitest" })
	public readonly testRunner?: "jest" | "vitest";

	@IsOptional()
	@ValidateNested()
	@Type(() => ExtraPackagesDTO)
	@ApiProperty({ description: "The extra packages to include", type: [ExtraPackagesDTO] })
	public readonly extraPackages?: ExtraPackagesDTO[];
}
