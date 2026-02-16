import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { appTemplates, configFilesTemplates, mainTemplate, readmeTemplate } from "./templates";

/**
 * Core Plugin - Generates the base NestJS project structure
 *
 * This plugin is always active and creates:
 * - src/app.module.ts, app.controller.ts, app.service.ts
 * - src/main.ts (platform-specific: Fastify or Express)
 * - nest-cli.json, tsconfig.json, tsconfig.build.json
 * - README.md
 */
@Plugin({
	name: "core",
	displayName: "Core",
	description: "Base NestJS project structure",
	priority: 1000
})
export class CorePlugin extends BasePlugin {
	shouldActivate(_ctx: GeneratorContext): boolean {
		return true;
	}

	protected onGenerate(): void {
		for (const template of appTemplates) {
			this.createFile(template.name, template.path, template.content);
		}

		const main = mainTemplate(this.mainType);
		this.createFile(main.name, main.path, main.content);

		for (const template of configFilesTemplates) {
			this.createFile(template.name, template.path, template.content);
		}

		this.createFile(".env", "", "");

		this.createFile(readmeTemplate.name, readmeTemplate.path, readmeTemplate.content);

		this.addScript("build", "nest build");
		this.addScript("start", "nest start");
		this.addScript("start:dev", "nest start --watch");
		this.addScript("start:debug", "nest start --debug --watch");
		this.addScript("start:prod", "node dist/main");
	}
}
