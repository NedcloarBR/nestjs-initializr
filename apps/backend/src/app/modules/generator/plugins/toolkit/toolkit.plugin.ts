import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { ToolkitImportTemplate, ToolkitRegisterTemplate } from "./templates";

/**
 * Toolkit Plugin - @nedcloarbr/nestjs-toolkit integration
 *
 * This plugin:
 * - Adds nestjs-toolkit dependency
 * - Updates main.ts to import and call registerHelpers
 */
@Plugin({
	name: "toolkit",
	displayName: "NestJS Toolkit",
	description: "Integrates @nedcloarbr/nestjs-toolkit with registerHelpers",
	priority: 100
})
export class ToolkitPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("toolkit") ?? false;
	}

	protected onGenerate(): void {
		// Add toolkit dependency
		this.addPkg("@nedcloarbr/nestjs-toolkit");

		// Add import to main.ts
		this.replaceInFile(
			"src",
			"main.ts",
			'import { AppModule } from "./app.module";',
			`import { AppModule } from "./app.module";\n${ToolkitImportTemplate}`
		);

		// Add registerHelpers call before globalPrefix
		const globalPrefixLine = this.withConfig
			? 'const globalPrefix = configService.get("GLOBAL_PREFIX");'
			: 'const globalPrefix = "api";';

		this.replaceInFile("src", "main.ts", globalPrefixLine, `${ToolkitRegisterTemplate}\n\t${globalPrefixLine}`);
	}
}
