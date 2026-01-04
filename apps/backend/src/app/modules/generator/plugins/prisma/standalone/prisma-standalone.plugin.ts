import { GeneratorContext, Plugin } from "@/app/common";
import { PrismaBasePlugin } from "../prisma-base";
import { PrismaStandaloneTemplates } from "./templates/prisma-standalone.templates";

@Plugin({
	name: "prisma-standalone",
	displayName: "Prisma Standalone",
	description: "Prisma ORM integration for database management",
	priority: 800,
  conflicts: ["nestjs-prisma"],
	dependencies: ["docker"]
})
export class PrismaPlugin extends PrismaBasePlugin {
	public shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("prisma-standalone") ?? false;
	}

	protected generateTemplates(): void {
    const templates = PrismaStandaloneTemplates(this.withConfig, this.ctx.metadata.database.find(db => db.module === "prisma")?.prismaType || "postgres");
    this.createFile(templates.module.name, templates.module.path, templates.module.content);
    this.createFile(templates.service.name, templates.service.path, templates.service.content);
  }
}
