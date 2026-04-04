import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { TestRunnerPlugin } from "@/app/modules/generator/plugins/test-runner/test-runner.plugin";

describe("TestRunnerPlugin", () => {
	let plugin: TestRunnerPlugin;

	beforeEach(() => {
		plugin = new TestRunnerPlugin();
	});

	describe("shouldActivate()", () => {
		it("returns true when testRunner is jest", () => {
			expect(plugin.shouldActivate!(makeContext({ testRunner: "jest" }))).toBe(true);
		});

		it("returns true when testRunner is vitest", () => {
			expect(plugin.shouldActivate!(makeContext({ testRunner: "vitest" }))).toBe(true);
		});

		it("returns false when testRunner is not set", () => {
			expect(plugin.shouldActivate!(makeContext())).toBe(false);
		});
	});

	describe("common packages", () => {
		it("always adds @nestjs/testing regardless of runner", async () => {
			for (const testRunner of ["jest", "vitest"] as const) {
				const result = await plugin.generate(makeContext({ testRunner }));
				expect(result.packages.map((p) => p.name)).toContain("@nestjs/testing");
			}
		});

		it("always adds supertest regardless of runner", async () => {
			for (const testRunner of ["jest", "vitest"] as const) {
				const result = await plugin.generate(makeContext({ testRunner }));
				expect(result.packages.map((p) => p.name)).toContain("supertest");
			}
		});
	});

	describe("jest setup", () => {
		it("creates jest.config.ts", async () => {
			const ctx = makeContext({ testRunner: "jest" });
			const result = await plugin.generate(ctx);

			expect(result.files.map((f) => f.name)).toContain("jest.config.ts");
		});

		it("adds jest, @types/jest and ts-jest as dev dependencies", async () => {
			const ctx = makeContext({ testRunner: "jest" });
			const result = await plugin.generate(ctx);

			const pkgNames = result.packages.map((p) => p.name);
			expect(pkgNames).toContain("jest");
			expect(pkgNames).toContain("@types/jest");
			expect(pkgNames).toContain("ts-jest");
		});

		it("adds test scripts", async () => {
			const ctx = makeContext({ testRunner: "jest" });
			const result = await plugin.generate(ctx);

			const scriptNames = result.scripts.map((s) => s.name);
			expect(scriptNames.some((n) => n.includes("test"))).toBe(true);
		});

		it("does not create vitest config", async () => {
			const ctx = makeContext({ testRunner: "jest" });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names).not.toContain("vitest.config.ts");
		});
	});

	describe("vitest setup", () => {
		it("creates vitest.config.ts", async () => {
			const ctx = makeContext({ testRunner: "vitest" });
			const result = await plugin.generate(ctx);

			expect(result.files.map((f) => f.name)).toContain("vitest.config.ts");
		});

		it("adds vitest and related packages as dev dependencies", async () => {
			const ctx = makeContext({ testRunner: "vitest" });
			const result = await plugin.generate(ctx);

			const pkgNames = result.packages.map((p) => p.name);
			expect(pkgNames).toContain("vitest");
			expect(pkgNames).toContain("@vitest/coverage-v8");
		});

		it("adds test scripts", async () => {
			const ctx = makeContext({ testRunner: "vitest" });
			const result = await plugin.generate(ctx);

			const scriptNames = result.scripts.map((s) => s.name);
			expect(scriptNames.some((n) => n.includes("test"))).toBe(true);
		});

		it("does not create jest config", async () => {
			const ctx = makeContext({ testRunner: "vitest" });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names).not.toContain("jest.config.ts");
		});
	});
});
