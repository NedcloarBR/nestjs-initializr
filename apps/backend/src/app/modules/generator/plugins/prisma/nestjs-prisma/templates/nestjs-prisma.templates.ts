export function NestJSPrismaTemplates(withConfigModule: boolean, type: string) {
	const adapters: Record<string, { name: string; adapter: string }> = {
		postgres: { name: "pg", adapter: "PrismaPg" }
	};

	return {
		module: {
			name: "prisma.module.ts",
			path: "src/modules/database/prisma",
			content: `
import { Module } from "@nestjs/common";
import { CustomPrismaModule } from "nestjs-prisma/dist/custom";
import { prisma } from "./prisma.extension";
${withConfigModule ? 'import { ConfigService } from "@/modules/config/config.service";' : ""}
import { Services } from "@/constants/services";

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: Services.Prisma,
      useFactory: (${withConfigModule ? "configService: ConfigService" : ""}) => {
        return prisma${withConfigModule ? "(configService)" : "()"};
      },
      ${withConfigModule ? "inject: [Services.Config]" : ""}
    }),
  ],
})
export class PrismaModule {}
`.trim()
		},
		extension: {
			name: "prisma.extension.ts",
			path: "src/modules/database/prisma",
			content: `
import { ${adapters[type].adapter} } from "@prisma/adapter-${adapters[type].name}";
import { PrismaClient } from "@/generated/prisma/client";
${withConfigModule ? 'import { ConfigService } from "@/modules/config/config.service";' : ""}

export const prisma = (${withConfigModule ? "configService: ConfigService" : ""}) => {
  const adapter = new ${adapters[type].adapter}({ connectionString: ${withConfigModule ? 'configService.get("DATABASE_URL")' : "process.env.DATABASE_URL"} });
  return new PrismaClient({ adapter });
}

export type PrismaClientType = ReturnType<typeof prisma>;
`.trim()
		}
	};
}
