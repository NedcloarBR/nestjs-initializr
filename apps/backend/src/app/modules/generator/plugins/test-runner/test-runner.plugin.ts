import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import {
	JestConfigTemplate,
	VitestConfigTemplate,
	jestScripts,
	vitestScripts
} from "./templates";

/**
 * Test Runner Plugin - Jest or Vitest configuration
 *
 * This plugin:
 * - Adds test dependencies (jest/vitest + common testing packages)
 * - Creates config file (jest.config.ts or vitest.config.ts)
 * - Adds test scripts to package.json
 */
@Plugin({
	name: "test-runner",
	displayName: "Test Runner",
	description: "Configures Jest or Vitest with scripts and dependencies",
	priority: 50
})
export class TestRunnerPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return !!ctx.metadata.testRunner;
	}

	protected onGenerate(): void {
		// Common test dependencies
		this.addDevPkg("@nestjs/testing");
		this.addDevPkg("supertest");
		this.addDevPkg("@types/supertest");

		if (this.testRunner === "jest") {
			this.generateJest();
		}

		if (this.testRunner === "vitest") {
			this.generateVitest();
		}
	}

	private generateJest(): void {
		// Jest dependencies
		this.addDevPkg("jest");
		this.addDevPkg("@types/jest");
		this.addDevPkg("ts-jest");

		// Config file
		this.createFile("jest.config.ts", "", JestConfigTemplate);

		// Scripts
		for (const script of jestScripts) {
			this.addScript(script.name, script.command);
		}
	}

	private generateVitest(): void {
		// Vitest dependencies
		this.addDevPkg("vitest");
		this.addDevPkg("vite-tsconfig-paths");
		this.addDevPkg("@vitest/ui");
		this.addDevPkg("@vitest/coverage-v8");

		// Config file
		this.createFile("vitest.config.ts", "", VitestConfigTemplate);

		// Scripts
		for (const script of vitestScripts) {
			this.addScript(script.name, script.command);
		}
	}
}
