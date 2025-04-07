import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { ModulesMetadataDTO } from "./modules-metadata.dto";

export class MetadataDTO {
	@IsString()
	@IsIn(["express", "fastify"], { message: "Main type must be either 'express' or 'fastify'" })
	public readonly mainType!: "express" | "fastify";

	@IsString()
	@IsNotEmpty()
	@Matches(/^(?:@[a-z0-9-*~][a-z0-9-._~]*\/)?[a-z0-9-*~][a-z0-9-._~]*$/)
	public readonly name!: string;

	@IsString()
	@IsOptional()
	public readonly description?: string;

	@IsString()
	@IsIn(["20", "21", "22", "23"], { message: "Node version must be one of the following: 20, 21, 22, 23" })
	public readonly nodeVersion!: "20" | "21" | "22" | "23";

	@ValidateNested()
	@Type(() => ModulesMetadataDTO)
	@IsOptional()
	public readonly modules?: ModulesMetadataDTO;
}
