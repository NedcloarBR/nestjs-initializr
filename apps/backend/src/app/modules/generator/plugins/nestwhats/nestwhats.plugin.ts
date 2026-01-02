import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { nestwhatsModuleTemplate, nestwhatsServiceTemplate } from "./templates";

/**
 * NestWhats Plugin - WhatsApp bot framework for NestJS
 *
 * This plugin creates:
 * - src/modules/nestwhats/nestwhats.module.ts (NestWhatsWrapperModule)
 * - src/modules/nestwhats/nestwhats.service.ts (event handlers)
 */
@Plugin({
	name: "nestwhats",
	displayName: "NestWhats",
	description: "WhatsApp bot framework with whatsapp-web.js integration",
	priority: 400
})
export class NestWhatsPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("nestwhats") ?? false;
	}

	protected onGenerate(): void {
		// Create nestwhats module
		this.createFile(nestwhatsModuleTemplate.name, nestwhatsModuleTemplate.path, nestwhatsModuleTemplate.content);

		// Create nestwhats service
		this.createFile(nestwhatsServiceTemplate.name, nestwhatsServiceTemplate.path, nestwhatsServiceTemplate.content);

		// Add dependencies
		this.addPkg("nestwhats");
		this.addPkg("whatsapp-web.js");

		// Set constants for other plugins
		this.setConstants({
			token: null,
			import: "NestWhatsWrapperModule",
			export: 'export { NestWhatsWrapperModule } from "./nestwhats/nestwhats.module";',
			importArray: "NestWhatsWrapperModule",
			inject: null,
			importIn: "src/app.module.ts"
		});
	}
}
