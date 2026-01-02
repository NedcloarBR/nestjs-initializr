import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { biomeTemplate, eslintPrettierTemplate } from "./templates";

/**
 * Linter/Formatter Plugin - Generates linting and formatting configuration
 *
 * Supports two options:
 * - Biome: Fast all-in-one linter and formatter
 * - ESLint + Prettier: Traditional setup with separate tools
 */
@Plugin({
	name: "linter-formatter",
	displayName: "Linter/Formatter",
	description: "Code linting and formatting with Biome or ESLint+Prettier",
	priority: 800 // High priority - runs early for other plugins to depend on
})
export class LinterFormatterPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.linterFormatter !== undefined;
	}

	protected onGenerate(): void {
		if (this.linterFormatter === "biome") {
			this.setupBiome();
		}
    if (this.linterFormatter === "eslint-prettier") {
			this.setupEslintPrettier();
		}
	}

	private setupBiome(): void {
		// Create biome.json
		this.createFile(biomeTemplate.config.name, biomeTemplate.config.path, biomeTemplate.config.content);

		// Add packages
		this.addDevPkg("@biomejs/biome");
		this.addDevPkg("@nedcloarbr/biome-config");

		// Add scripts
		for (const script of biomeTemplate.scripts) {
			this.addScript(script.name, script.command);
		}
	}

	private setupEslintPrettier(): void {
		// Create config files
		this.createFile(
			eslintPrettierTemplate.prettierrc.name,
			eslintPrettierTemplate.prettierrc.path,
			eslintPrettierTemplate.prettierrc.content
		);
		this.createFile(
			eslintPrettierTemplate.eslintConfig.name,
			eslintPrettierTemplate.eslintConfig.path,
			eslintPrettierTemplate.eslintConfig.content
		);

		// Add packages
		this.addDevPkg("@eslint/eslintrc");
		this.addDevPkg("@eslint/js");
		this.addDevPkg("eslint");
		this.addDevPkg("eslint-config-prettier");
		this.addDevPkg("eslint-plugin-prettier");
		this.addDevPkg("prettier");
		this.addDevPkg("typescript-eslint");

		// Add scripts
		for (const script of eslintPrettierTemplate.scripts) {
			this.addScript(script.name, script.command);
		}
	}
}
