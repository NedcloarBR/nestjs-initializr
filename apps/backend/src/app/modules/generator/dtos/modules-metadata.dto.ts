import { IsBoolean, IsOptional } from "class-validator";

export class ModulesMetadataDTO {
	@IsOptional()
	@IsBoolean()
	public readonly moduleNames: [];
}
