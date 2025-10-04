import { IsBoolean, IsString, Matches } from "class-validator";

export class ExtraPackagesDTO {
	@IsString()
	public readonly name!: string;

	@IsString()
	@Matches(/^\d+\.\d+\.\d+(-.+)?$/, { message: "Version must be in the format x.y.z or x.y.z-suffix" })
	public readonly version!: string;

	@IsBoolean()
	public readonly dev!: boolean;
}
