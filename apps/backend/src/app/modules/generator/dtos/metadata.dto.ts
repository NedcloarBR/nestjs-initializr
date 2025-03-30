import { IsString } from "class-validator";

export class MetadataDTO {
	@IsString()
	public readonly name: string;

	@IsString()
	public readonly description: string;

	@IsString()
	public readonly nodeVersion: string;
}
