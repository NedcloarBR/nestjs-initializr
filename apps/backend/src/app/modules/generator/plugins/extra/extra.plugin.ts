import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { compressionTemplates, corsTemplates, helmetTemplates, validationTemplates } from "./templates";

/**
 * Extra Plugin - Generates configuration for extras (cors, helmet, compression, validation)
 *
 * This plugin updates main.ts to include the selected extras:
 * - CORS: Enables CORS with default configuration
 * - Helmet: Adds security headers (fastify or express variant)
 * - Compression: Enables response compression (fastify or express variant)
 * - Validation: Adds global ValidationPipe with class-validator/class-transformer
 */
@Plugin({
	name: "extra",
	displayName: "Extras",
	description: "Additional configurations for CORS, Helmet, Compression and Validation",
	priority: 100 // Low priority - runs after main.ts is created
})
export class ExtraPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		const extras = ctx.metadata.extras ?? [];
		return extras.length > 0;
	}

	protected onGenerate(): void {
		const extras = this.ctx.metadata.extras ?? [];

		if (extras.includes("helmet")) {
			this.setupHelmet();
		}

		if (extras.includes("compression")) {
			this.setupCompression();
		}

		if (extras.includes("validation")) {
			this.setupValidation();
		}

		if (extras.includes("cors")) {
			this.setupCors();
		}
	}

	private setupHelmet(): void {
		const templates = helmetTemplates(this.mainType, this.withConfig);

		this.replaceInFile("src", "main.ts", templates.import.replacer, templates.import.content);

		this.replaceInFile("src", "main.ts", templates.mainUpdate.replacer, templates.mainUpdate.content);

		this.addPkg(this.isFastify ? "@fastify/helmet" : "helmet");
	}

	private setupCompression(): void {
		const templates = compressionTemplates(this.mainType, this.withConfig);

		this.replaceInFile("src", "main.ts", templates.import.replacer, templates.import.content);

		this.replaceInFile("src", "main.ts", templates.mainUpdate.replacer, templates.mainUpdate.content);

		this.addPkg(this.isFastify ? "@fastify/compress" : "compression");
	}

	private setupValidation(): void {
		const templates = validationTemplates(this.withConfig);

		this.replaceInFile("src", "main.ts", templates.import.replacer, templates.import.content);

		this.replaceInFile("src", "main.ts", templates.mainUpdate.replacer, templates.mainUpdate.content);

		this.addPkg("class-validator");
		this.addPkg("class-transformer");
	}

	private setupCors(): void {
		const templates = corsTemplates(this.withConfig);

		this.replaceInFile("src", "main.ts", templates.mainUpdate.replacer, templates.mainUpdate.content);
	}
}
