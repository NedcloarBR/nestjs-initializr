import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { I18nPlugin } from "@/app/modules/generator/plugins/i18n/i18n.plugin";

describe("I18nPlugin", () => {
	let plugin: I18nPlugin;

	beforeEach(() => {
		plugin = new I18nPlugin();
	});

	describe("shouldActivate()", () => {
		it("returns true when i18n module is selected", () => {
			expect(plugin.shouldActivate!(makeContext({ modules: ["i18n"] }))).toBe(true);
		});

		it("returns false when i18n module is not selected", () => {
			expect(plugin.shouldActivate!(makeContext({ modules: [] }))).toBe(false);
		});
	});

	describe("generate() — base behavior", () => {
		it("creates the i18n module file", async () => {
			const ctx = makeContext({ modules: ["i18n"] });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names.some((n) => n.includes("i18n") && n.endsWith(".ts"))).toBe(true);
		});

		it("creates a translation JSON file", async () => {
			const ctx = makeContext({ modules: ["i18n"] });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names.some((n) => n.endsWith(".json"))).toBe(true);
		});

		it("adds nestjs-i18n as a production dependency", async () => {
			const ctx = makeContext({ modules: ["i18n"] });
			const result = await plugin.generate(ctx);

			expect(result.packages.map((p) => p.name)).toContain("nestjs-i18n");
		});

		it("adds file updates for nest-cli.json", async () => {
			const ctx = makeContext({ modules: ["i18n"] });
			const result = await plugin.generate(ctx);

			const updates = result.fileUpdates.filter((u) => u.fileName === "nest-cli.json");
			expect(updates.length).toBeGreaterThan(0);
		});

		it("adds file updates for app.service.ts", async () => {
			const ctx = makeContext({ modules: ["i18n"] });
			const result = await plugin.generate(ctx);

			const updates = result.fileUpdates.filter((u) => u.fileName === "app.service.ts");
			expect(updates.length).toBeGreaterThan(0);
		});

		it("sets constants with I18nWrapperModule as import", async () => {
			const ctx = makeContext({ modules: ["i18n"] });
			const result = await plugin.generate(ctx);

			expect(result.constants?.import).toBe("I18nWrapperModule");
			expect(result.constants?.importArray).toBe("I18nWrapperModule");
		});

		it("sets constants export pointing to the i18n module", async () => {
			const ctx = makeContext({ modules: ["i18n"] });
			const result = await plugin.generate(ctx);

			expect(result.constants?.export).toContain("I18nWrapperModule");
		});

		it("sets constants importIn pointing to app.module.ts", async () => {
			const ctx = makeContext({ modules: ["i18n"] });
			const result = await plugin.generate(ctx);

			expect(result.constants?.importIn).toBe("src/app.module.ts");
		});
	});

	describe("generate() — with config module", () => {
		it("creates additional config and env DTO files when config is enabled", async () => {
			const ctx = makeContext({ modules: ["config", "i18n"] });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names.length).toBeGreaterThan(2);
		});

		it("adds more file updates when config is enabled", async () => {
			const ctxWithConfig = makeContext({ modules: ["config", "i18n"] });
			const ctxWithout = makeContext({ modules: ["i18n"] });

			const withConfigResult = await plugin.generate(ctxWithConfig);
			const withoutResult = await plugin.generate(ctxWithout);

			expect(withConfigResult.fileUpdates.length).toBeGreaterThan(withoutResult.fileUpdates.length);
		});

		it("adds .env file update when config is enabled", async () => {
			const ctx = makeContext({ modules: ["config", "i18n"] });
			const result = await plugin.generate(ctx);

			const envUpdates = result.fileUpdates.filter((u) => u.fileName === ".env");
			expect(envUpdates.length).toBeGreaterThan(0);
		});
	});
});
