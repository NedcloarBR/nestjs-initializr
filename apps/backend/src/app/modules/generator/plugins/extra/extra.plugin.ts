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

		// Process each extra in order to ensure proper replacements
		// Order matters: imports first, then main updates
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

		// Add import statement
		this.replaceInFile("src", "main.ts", templates.import.replacer, templates.import.content);

		// Add helmet setup after port declaration
		this.replaceInFile("src", "main.ts", templates.mainUpdate.replacer, templates.mainUpdate.content);

		// Add package dependency
		if (this.isFastify) {
			this.addPkg("@fastify/helmet");
		} else {
			this.addPkg("helmet");
		}
	}

	private setupCompression(): void {
		const templates = compressionTemplates(this.mainType, this.withConfig);

		// Add import statement
		this.replaceInFile("src", "main.ts", templates.import.replacer, templates.import.content);

		// Add compression setup after port declaration
		this.replaceInFile("src", "main.ts", templates.mainUpdate.replacer, templates.mainUpdate.content);

		// Add package dependency
		if (this.isFastify) {
			this.addPkg("@fastify/compress");
		} else {
			this.addPkg("compression");
		}
	}

	private setupValidation(): void {
		const templates = validationTemplates(this.withConfig);

		// Add ValidationPipe to imports
		this.replaceInFile("src", "main.ts", templates.import.replacer, templates.import.content);

		// Add validation pipe setup after port declaration
		this.replaceInFile("src", "main.ts", templates.mainUpdate.replacer, templates.mainUpdate.content);

		// Add package dependencies
		this.addPkg("class-validator");
		this.addPkg("class-transformer");
	}

	private setupCors(): void {
		const templates = corsTemplates(this.withConfig);

		// Add CORS setup after port declaration
		this.replaceInFile("src", "main.ts", templates.mainUpdate.replacer, templates.mainUpdate.content);

		// CORS doesn't need additional packages - it's built into @nestjs/common
	}
}
