import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { CorePlugin } from "@/app/modules/generator/plugins/core/core.plugin";

describe("CorePlugin", () => {
	let plugin: CorePlugin;

	beforeEach(() => {
		plugin = new CorePlugin();
	});

	describe("shouldActivate()", () => {
		it("always returns true", () => {
			expect(plugin.shouldActivate!(makeContext())).toBe(true);
			expect(plugin.shouldActivate!(makeContext({ mainType: "express" }))).toBe(true);
		});
	});

	describe("generate()", () => {
		it("creates core app files", async () => {
			const ctx = makeContext();
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names).toContain("app.module.ts");
			expect(names).toContain("app.controller.ts");
			expect(names).toContain("app.service.ts");
		});

		it("creates main.ts", async () => {
			const ctx = makeContext();
			const result = await plugin.generate(ctx);

			expect(result.files.map((f) => f.name)).toContain("main.ts");
		});

		it("creates config files (tsconfig, nest-cli)", async () => {
			const ctx = makeContext();
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names).toContain("tsconfig.json");
			expect(names).toContain("nest-cli.json");
		});

		it("creates README.md", async () => {
			const ctx = makeContext();
			const result = await plugin.generate(ctx);

			expect(result.files.map((f) => f.name)).toContain("README.md");
		});

		it("creates .env file", async () => {
			const ctx = makeContext();
			const result = await plugin.generate(ctx);

			expect(result.files.map((f) => f.name)).toContain(".env");
		});

		it("fastify main.ts references fastify adapter", async () => {
			const ctx = makeContext({ mainType: "fastify" });
			const result = await plugin.generate(ctx);

			const main = result.files.find((f) => f.name === "main.ts")!;
			expect(main.content.toLowerCase()).toContain("fastify");
		});

		it("express main.ts references express adapter", async () => {
			const ctx = makeContext({ mainType: "express" });
			const result = await plugin.generate(ctx);

			const main = result.files.find((f) => f.name === "main.ts")!;
			expect(main.content.toLowerCase()).toContain("express");
		});

		it("adds standard npm scripts", async () => {
			const ctx = makeContext();
			const result = await plugin.generate(ctx);

			const scriptNames = result.scripts.map((s) => s.name);
			expect(scriptNames).toContain("build");
			expect(scriptNames).toContain("start");
			expect(scriptNames).toContain("start:dev");
			expect(scriptNames).toContain("start:prod");
		});

		it("generates no packages", async () => {
			const ctx = makeContext();
			const result = await plugin.generate(ctx);

			expect(result.packages).toHaveLength(0);
		});
	});
});
