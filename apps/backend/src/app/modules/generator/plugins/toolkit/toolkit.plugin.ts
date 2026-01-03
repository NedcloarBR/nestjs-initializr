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
		this.addPkg("@nedcloarbr/nestjs-toolkit");

		this.replaceInFile(
			"src",
			"main.ts",
			'import { AppModule } from "./app.module";',
			`import { AppModule } from "./app.module";\n${ToolkitImportTemplate}`
		);

		const globalPrefixLine = this.withConfig
			? 'const globalPrefix = configService.get("GLOBAL_PREFIX");'
			: 'const globalPrefix = "api";';

		this.replaceInFile("src", "main.ts", globalPrefixLine, `${ToolkitRegisterTemplate}\n\t${globalPrefixLine}`);
	}
}
