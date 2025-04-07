export const content = `
import { IsNumber, IsString, IsNotEmpty, IsOptional, IsEnum, Min, Max } from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
  Test = "test"
};

class EnvDTO {
  @IsEnum(Environment)
  @IsOptional()
  public readonly NODE_ENV?: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  public readonly PORT!: number;

  @IsString()
  @IsNotEmpty()
  public readonly GLOBAL_PREFIX!: string;
}

export default registerAs<typeof EnvDTO>("env", () => ({
  validateConfig(process.env, EnvDTO);

  return {
    NODE_ENV: process.env.NODE_ENV || Environment.Development,
    PORT: process.env.PORT,
    GLOBAL_PREFIX: process.env.GLOBAL_PREFIX,
  };
})
`;
