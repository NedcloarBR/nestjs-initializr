export const prismaConfigIntegrationTemplates = {
	prismaEnvConfig: {
		name: "prisma-env.dto.ts",
		path: "src/modules/database/prisma/dtos",
		content: `
import { registerAs } from "@nestjs/config";
import { IsString, IsNotEmpty } from "class-validator";
import validateConfig from "@/modules/config/config.validator";

export class PrismaEnvDTO {
  @IsString()
  @IsNotEmpty()
  public readonly DATABASE_URL!: string;
}

export default registerAs("prisma_env", () => {
  validateConfig(process.env, PrismaEnvDTO);

  return {
    DATABASE_URL: process.env.DATABASE_URL || ""
	};
});
  `.trim()
	},
	indexDTs: {
		replacer: "GLOBAL_PREFIX: string;",
		content: "GLOBAL_PREFIX: string;\n    DATABASE_URL: string;"
	},
	configModuleImport: {
		replacer: 'import EnvConfig from "./dtos/env.dto"',
		content:
			'import EnvConfig from "./dtos/env.dto";\nimport PrismaEnvConfig from "@/modules/database/prisma/dtos/prisma-env.dto";'
	},
	configModuleLoad: {
		replacer: "load: [EnvConfig",
		content: "load: [EnvConfig, PrismaEnvConfig"
	},
	configServiceImport: {
		replacer: 'import { EnvDTO } from "./dtos/env.dto";',
		content:
			'import { EnvDTO } from "./dtos/env.dto";\nimport { PrismaEnvDTO } from "@/modules/database/prisma/dtos/prisma-env.dto";'
	},
	configServiceType: {
		replacer: "InstanceType<typeof EnvDTO>",
		content: "InstanceType<typeof EnvDTO> & InstanceType<typeof PrismaEnvDTO>"
	}
};
