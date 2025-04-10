import { Type } from "class-transformer";
import { IsIn, IsNotEmptyObject, IsOptional, IsString, ValidateNested, isNotEmptyObject } from "class-validator";
import { ModulesMetadataDTO } from "./modules-metadata.dto";
import { PackageJsonMetadataDTO } from "./package-json-metadata.dto";

export class MetadataDTO {
	@IsString()
	@IsIn(["express", "fastify"], { message: "Main type must be either 'express' or 'fastify'" })
	public readonly mainType!: "express" | "fastify";

	@ValidateNested()
	@Type(() => PackageJsonMetadataDTO)
	@IsNotEmptyObject()
	public readonly packageJson!: PackageJsonMetadataDTO;

	// @ValidateNested()
	// @Type(() => ModulesMetadataDTO)
	// @IsOptional()
	public readonly modules?: string[];
}
