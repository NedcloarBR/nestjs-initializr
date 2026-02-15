import { Logger } from "@nestjs/common";
import type { DEV_NPM_PACKAGE_KEYS, NPM_PACKAGE_KEYS } from "@/types";
import { BasePlugin } from "../../core/base-plugin";
import { PrismaBaseTemplates } from "./templates";

export abstract class PrismaBasePlugin extends BasePlugin {
	public logger = new Logger(PrismaBasePlugin.name);

	protected onGenerate(): void {
		this.addPkg("@prisma/client");
		this.addDevPkg("prisma");
		this.addPkg("dotenv");

		const primaryDatabase = this.ctx.metadata.database?.find((db) => db.module === "prisma");
		if (primaryDatabase) {
			const dbPackages = this.getDatabasePackage(primaryDatabase.prismaType);
			for (const pkg of dbPackages) {
				pkg.dev ? this.addDevPkg(pkg.name as DEV_NPM_PACKAGE_KEYS) : this.addPkg(pkg.name as NPM_PACKAGE_KEYS);
			}
		}
		this.addRootFolder("prisma");
		this.generateBaseTemplates();
		this.generateTemplates();

		this.setConstants({
			token: null,
			import: "PrismaModule",
			export: 'export { PrismaModule } from "./prisma/prisma.module";',
			importArray: "PrismaModule",
			inject: null,
			importIn: "src/app.module.ts"
		});
	}

	protected abstract generateTemplates(): void;

	private generateBaseTemplates(): void {
		const templates = PrismaBaseTemplates(
			this.ctx.metadata.database.find((db) => db.module === "prisma")?.prismaType || "postgres"
		);
		this.createFile(templates.prismaConfig.name, templates.prismaConfig.path, templates.prismaConfig.content);

		this.createFile(templates.prismaSchema.name, templates.prismaSchema.path, templates.prismaSchema.content);

		this.addScript("postinstall", "prisma generate");

		this.ctx.metadata.modules.includes("config")
			? this.appendToFile("", ".env", `\n${templates.dotenv.content}`)
			: this.createFile(".env", "", templates.dotenv.content);

		this.replaceInFile(
			"",
			"docker-compose.yml",
			templates.dockerCompose.dependsOn.replacer,
			templates.dockerCompose.dependsOn.content
		);
		this.appendToFile("", "docker-compose.yml", templates.dockerCompose.service.content);
	}

	private getDatabasePackage(type: string) {
		const databasePackages: Record<string, { name: NPM_PACKAGE_KEYS | DEV_NPM_PACKAGE_KEYS; dev: boolean }[]> = {
			postgres: [
				{ name: "pg", dev: false },
				{ name: "@types/pg", dev: true },
				{ name: "@prisma/adapter-pg", dev: false }
			]
		};

		return databasePackages[type] || [];
	}
}
