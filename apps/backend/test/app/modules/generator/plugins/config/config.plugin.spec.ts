import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { ConfigPlugin } from "@/app/modules/generator/plugins/config/config.plugin";

describe("ConfigPlugin", () => {
	let plugin: ConfigPlugin;

	beforeEach(() => {
		plugin = new ConfigPlugin();
	});

	describe("shouldActivate()", () => {
		it("returns true when config module is selected", () => {
			expect(plugin.shouldActivate!(makeContext({ modules: ["config"] }))).toBe(true);
		});

		it("returns false when config module is not selected", () => {
			expect(plugin.shouldActivate!(makeContext({ modules: [] }))).toBe(false);
		});
	});

	describe("generate()", () => {
		it("creates the config module files", async () => {
			const ctx = makeContext({ modules: ["config"] });
			const result = await plugin.generate(ctx);

			expect(result.files.length).toBeGreaterThan(0);
		});

		it("creates a main.ts variant file", async () => {
			const ctx = makeContext({ modules: ["config"] });
			const result = await plugin.generate(ctx);

			expect(result.files.map((f) => f.name)).toContain("main.ts");
		});

		it("fastify main.ts references fastify", async () => {
			const ctx = makeContext({ modules: ["config"], mainType: "fastify" });
			const result = await plugin.generate(ctx);

			const main = result.files.find((f) => f.name === "main.ts")!;
			expect(main.content.toLowerCase()).toContain("fastify");
		});

		it("express main.ts references express", async () => {
			const ctx = makeContext({ modules: ["config"], mainType: "express" });
			const result = await plugin.generate(ctx);

			const main = result.files.find((f) => f.name === "main.ts")!;
			expect(main.content.toLowerCase()).toContain("express");
		});

		it("adds @nestjs/config as production dependency", async () => {
			const ctx = makeContext({ modules: ["config"] });
			const result = await plugin.generate(ctx);

			expect(result.packages.map((p) => p.name)).toContain("@nestjs/config");
		});

		it("adds class-validator and class-transformer", async () => {
			const ctx = makeContext({ modules: ["config"] });
			const result = await plugin.generate(ctx);

			const pkgNames = result.packages.map((p) => p.name);
			expect(pkgNames).toContain("class-validator");
			expect(pkgNames).toContain("class-transformer");
		});

		it("adds a file update targeting services.ts", async () => {
			const ctx = makeContext({ modules: ["config"] });
			const result = await plugin.generate(ctx);

			const updates = result.fileUpdates.filter((u) => u.fileName === "services.ts");
			expect(updates.length).toBeGreaterThan(0);
		});

		it("adds a file update appending to .env", async () => {
			const ctx = makeContext({ modules: ["config"] });
			const result = await plugin.generate(ctx);

			const envUpdates = result.fileUpdates.filter((u) => u.filePath === ".env" || u.fileName === ".env");
			expect(envUpdates.length).toBeGreaterThan(0);
		});

		it("sets constants with ConfigModuleWrapper as import", async () => {
			const ctx = makeContext({ modules: ["config"] });
			const result = await plugin.generate(ctx);

			expect(result.constants?.import).toBe("ConfigModuleWrapper");
			expect(result.constants?.importArray).toBe("ConfigModuleWrapper");
		});

		it("sets constants importIn pointing to app.module.ts", async () => {
			const ctx = makeContext({ modules: ["config"] });
			const result = await plugin.generate(ctx);

			expect(result.constants?.importIn).toBe("src/app.module.ts");
		});
	});
});
