export function PrismaStandaloneTemplates(withConfigModule: boolean, type: string) {
	const adapters: Record<string, { name: string; adapter: string }> = {
		postgres: { name: "pg", adapter: "PrismaPg" }
	};

	return {
		module: {
			name: "prisma.module.ts",
			path: "src/modules/database/prisma",
			content: `
import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
${withConfigModule ? 'import { ConfigModule } from "@/modules/config/config.module";' : ""}

@Module({
  imports: [${withConfigModule ? "ConfigModule" : ""}],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
`.trim()
		},
		service: {
			name: "prisma.service.ts",
			path: "src/modules/database/prisma",
			content: `
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "./generated/prisma/client";
import { ${adapters[type].adapter} } from "@prisma/adapter-${adapters[type].name}";
${withConfigModule ? 'import { ConfigService } from "@/modules/config/config.service";' : ""}

@Injectable()
export class PrismaService extends PrismaClient {
  public constructor(${withConfigModule ? "configService: ConfigService" : ""}) {
    const adapter = new ${adapters[type].adapter}({ url: ${withConfigModule ? "configService.get('DATABASE_URL')" : "process.env.DATABASE_URL!"} });
    super({ adapter });
  }
}
`.trim()
		}
	};
}
