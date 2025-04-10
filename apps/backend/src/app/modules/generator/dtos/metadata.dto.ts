import { Type } from "class-transformer";
import { IsIn, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from "class-validator";
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
	public readonly modules?: string[];
}
