import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class PackageJsonMetadataDTO {
	@IsString()
	@IsNotEmpty()
	@Matches(/^(?:@[a-z0-9-*~][a-z0-9-._~]*\/)?[a-z0-9-*~][a-z0-9-._~]*$/)
	@ApiProperty({ description: "The name of the package", example: "@scope/package" })
	public readonly name!: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ description: "The description of the package", example: "A brief description of the package" })
	public readonly description?: string;

	@IsString()
	@IsIn(["20", "21", "22", "23", "24"], { message: "Node version must be one of the following: 20, 21, 22, 23, 24" })
	@ApiProperty({ description: "The Node.js version to use", example: "20" })
	public readonly nodeVersion!: "20" | "21" | "22" | "23" | "24";
}
