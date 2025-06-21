import type { ExtraNames, ModuleNames } from "@/types";
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { PackageJsonMetadataDTO } from "./package-json-metadata.dto";

export class MetadataDTO {
	@IsString()
	@IsIn(["express", "fastify"], { message: "Main type must be either 'express' or 'fastify'" })
	public readonly mainType!: "express" | "fastify";

	@ValidateNested()
	@Type(() => PackageJsonMetadataDTO)
	@IsNotEmptyObject()
	public readonly packageJson!: PackageJsonMetadataDTO;

	@IsOptional()
	@IsString({ each: true })
	public readonly modules?: ModuleNames[];

	@IsString()
	@IsIn(["npm", "yarn", "pnpm"])
	public readonly packageManager!: "npm" | "yarn" | "pnpm";

	@IsOptional()
	@IsString({ each: true })
	public readonly extras?: ExtraNames[];

	@IsOptional()
	@IsString()
	@IsIn(["biome", "eslint-prettier"])
	public readonly linterFormatter?: "biome" | "eslint-prettier";

	@IsOptional()
	@IsBoolean()
	public readonly docker?: boolean;

	@IsOptional()
	@IsString()
	@IsIn(["jest", "vitest"])
	public readonly testRunner?: "jest" | "vitest";
}
