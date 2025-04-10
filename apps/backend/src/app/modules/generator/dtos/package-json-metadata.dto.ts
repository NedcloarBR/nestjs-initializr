import { IsIn, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class PackageJsonMetadataDTO {
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
}
