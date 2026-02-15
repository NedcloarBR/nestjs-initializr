export function NestJSPrismaTemplates(withConfigModule: boolean, type: string) {
	const adapters: Record<string, { name: string; adapter: string }> = {
		postgres: { name: "pg", adapter: "PrismaPg" }
	};

	return {
		module: {
			name: "prisma.module.ts",
			path: "src/modules/database/prisma",
			content: `
import { Module } from '@nestjs/common';
import { CustomPrismaModule } from 'nestjs-prisma/dist/custom';
import { prisma } from './prisma.extension';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return prisma;
      },
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
import { ${adapters[type]} } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/prisma/client';

const adapter = new ${adapters[type].adapter}({ url: ${withConfigModule ? "configService.get('DATABASE_URL')" : "process.env.DATABASE_URL!"} });
export const prisma = new PrismaClient({ adapter });

export type PrismaClientType = typeof prisma;
`.trim()
		}
	};
}
