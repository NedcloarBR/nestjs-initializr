import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString, Matches, ValidateIf } from "class-validator";

export class DatabaseDTO {
	@IsString()
	@IsIn(["prisma"], { message: "Module must be 'prisma'" })
	@ApiProperty({ description: "The database module to use", example: "prisma" })
	public readonly module!: "prisma";

	@IsString()
	@Matches(/^(postgres)$/, {
		message: "Database type must be one of the following: 'postgres'"
	})
	@ApiProperty({
		description: "The type of database (e.g., 'postgres')",
		example: "postgres"
	})
	@ValidateIf((obj) => obj.module === "prisma")
	public readonly prismaType?: "postgres";
}
