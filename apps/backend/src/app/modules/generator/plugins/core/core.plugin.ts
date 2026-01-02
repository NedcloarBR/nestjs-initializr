import { Plugin } from "@/app/common";
import {
	appTemplates,
	configFilesTemplates,
	mainTemplate,
	readmeTemplate
} from "./templates";
import { BasePlugin } from "../../core/base-plugin";

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
	priority: 1000 // Highest priority - runs first
})
export class CorePlugin extends BasePlugin {
	/**
	 * Always active - this is the base project
	 */
	public shouldActivate(): boolean {
		return true;
	}

	protected onGenerate(): void {
		// Generate app files (module, controller, service)
		for (const template of appTemplates) {
			this.createFile(template.name, template.path, template.content);
		}

		// Generate main.ts (platform-specific)
		const main = mainTemplate(this.mainType);
		this.createFile(main.name, main.path, main.content);

		// Generate config files (nest-cli.json, tsconfig.json, tsconfig.build.json)
		for (const template of configFilesTemplates) {
			this.createFile(template.name, template.path, template.content);
		}

		// Generate README.md
		this.createFile(readmeTemplate.name, readmeTemplate.path, readmeTemplate.content);

		// Add base scripts
		this.addScript("build", "nest build");
		this.addScript("start", "nest start");
		this.addScript("start:dev", "nest start --watch");
		this.addScript("start:debug", "nest start --debug --watch");
		this.addScript("start:prod", "node dist/main");
	}
}
