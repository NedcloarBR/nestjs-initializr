import { GeneratorContext, Plugin } from "@/app/common";
import { PrismaBasePlugin } from "../prisma-base";
import { NestJSPrismaTemplates } from "./templates/nestjs-prisma.templates";

@Plugin({
  name: "nestjs-prisma",
  displayName: "NestJS Prisma",
  description: "Prisma ORM integration for database management using nestjs-prisma",
  priority: 800,
  conflicts: ["prisma-standalone"],
  dependencies: ["docker"],
})
export class NestJSPrismaPlugin extends PrismaBasePlugin  {
  public shouldActivate(ctx: GeneratorContext): boolean {
    return ctx.metadata.modules?.includes("nestjs-prisma") ?? false;
  }

  protected generateTemplates(): void {
    const templates = NestJSPrismaTemplates(this.withConfig, this.ctx.metadata.database.find(db => db.module === "prisma")?.prismaType || "postgres");
    this.createFile(
      templates.module.name,
      templates.module.path,
      templates.module.content
    );

    this.createFile(
      templates.extension.name,
      templates.extension.path,
      templates.extension.content
    );
  }
}
