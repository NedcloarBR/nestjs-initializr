import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { huskyConfigTemplates, huskyHooksTemplates } from "./templates";

/**
 * Husky Plugin - Generates Git hooks configuration
 *
 * This plugin creates:
 * - .husky/pre-commit (runs lint-staged)
 * - .husky/commit-msg (runs commitlint)
 * - .commitlintrc.json (commitlint configuration)
 * - .lintstagedrc (lint-staged configuration based on linter/formatter)
 */
@Plugin({
	name: "husky",
	displayName: "Husky",
	description: "Git hooks with lint-staged and commitlint for code quality",
	priority: 200 // Low priority - runs after linter/formatter is configured
})
export class HuskyPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("husky") ?? false;
	}

	protected onGenerate(): void {
		const hooks = huskyHooksTemplates(this.packageManager);
		const configs = huskyConfigTemplates(this.linterFormatter);

		// Create husky hooks
		this.createFile(hooks.preCommit.name, hooks.preCommit.path, hooks.preCommit.content);
		this.createFile(hooks.commitMsg.name, hooks.commitMsg.path, hooks.commitMsg.content);

		// Create config files
		this.createFile(configs.commitlint.name, configs.commitlint.path, configs.commitlint.content);
		this.createFile(configs.lintStaged.name, configs.lintStaged.path, configs.lintStaged.content);

		// Add dev dependencies
		this.addDevPkg("husky");
		this.addDevPkg("lint-staged");
		this.addDevPkg("@commitlint/cli");
		this.addDevPkg("@commitlint/config-angular");

		// Add prepare script
		this.addScript("prepare", "husky");
	}
}
