import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, Matches } from "class-validator";

export class ExtraPackagesDTO {
	@IsString()
	@ApiProperty({ description: "The name of the package", example: "@scope/package" })
	public readonly name!: string;

	@IsString()
	@Matches(/^\d+\.\d+\.\d+(-.+)?$/, { message: "Version must be in the format x.y.z or x.y.z-suffix" })
	@ApiProperty({ description: "The version of the package", example: "1.0.0" })
	public readonly version!: string;

	@IsBoolean()
	@ApiProperty({ description: "Whether the package is a dev dependency", example: true })
	public readonly dev!: boolean;
}
