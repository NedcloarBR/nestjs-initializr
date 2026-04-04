import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { LinterFormatterPlugin } from "@/app/modules/generator/plugins/linter-formatter/linter-formatter.plugin";

describe("LinterFormatterPlugin", () => {
	let plugin: LinterFormatterPlugin;

	beforeEach(() => {
		plugin = new LinterFormatterPlugin();
	});

	describe("shouldActivate()", () => {
		it("returns true when linterFormatter is biome", () => {
			const ctx = makeContext({ linterFormatter: "biome" });
			expect(plugin.shouldActivate!(ctx)).toBe(true);
		});

		it("returns true when linterFormatter is eslint-prettier", () => {
			const ctx = makeContext({ linterFormatter: "eslint-prettier" });
			expect(plugin.shouldActivate!(ctx)).toBe(true);
		});

		it("returns false when linterFormatter is not set", () => {
			const ctx = makeContext();
			expect(plugin.shouldActivate!(ctx)).toBe(false);
		});
	});

	describe("biome setup", () => {
		it("creates biome config file", async () => {
			const ctx = makeContext({ linterFormatter: "biome" });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names.some((n) => n.toLowerCase().includes("biome"))).toBe(true);
		});

		it("adds @biomejs/biome as dev dependency", async () => {
			const ctx = makeContext({ linterFormatter: "biome" });
			const result = await plugin.generate(ctx);

			expect(result.packages.map((p) => p.name)).toContain("@biomejs/biome");
		});

		it("all biome packages are dev dependencies", async () => {
			const ctx = makeContext({ linterFormatter: "biome" });
			const result = await plugin.generate(ctx);

			for (const pkg of result.packages) {
				expect(pkg.dev).toBe(true);
			}
		});

		it("adds lint and format scripts", async () => {
			const ctx = makeContext({ linterFormatter: "biome" });
			const result = await plugin.generate(ctx);

			const scriptNames = result.scripts.map((s) => s.name);
			expect(scriptNames.some((n) => n.includes("lint") || n.includes("format") || n.includes("check"))).toBe(true);
		});

		it("does not create eslint or prettier files", async () => {
			const ctx = makeContext({ linterFormatter: "biome" });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name.toLowerCase());
			expect(names.some((n) => n.includes("eslint") || n.includes("prettier"))).toBe(false);
		});
	});

	describe("eslint-prettier setup", () => {
		it("creates .prettierrc config file", async () => {
			const ctx = makeContext({ linterFormatter: "eslint-prettier" });
			const result = await plugin.generate(ctx);

			expect(result.files.map((f) => f.name)).toContain(".prettierrc");
		});

		it("creates eslint config file", async () => {
			const ctx = makeContext({ linterFormatter: "eslint-prettier" });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name.toLowerCase());
			expect(names.some((n) => n.includes("eslint"))).toBe(true);
		});

		it("adds eslint, prettier and related packages", async () => {
			const ctx = makeContext({ linterFormatter: "eslint-prettier" });
			const result = await plugin.generate(ctx);

			const pkgNames = result.packages.map((p) => p.name);
			expect(pkgNames).toContain("eslint");
			expect(pkgNames).toContain("prettier");
		});

		it("all eslint-prettier packages are dev dependencies", async () => {
			const ctx = makeContext({ linterFormatter: "eslint-prettier" });
			const result = await plugin.generate(ctx);

			for (const pkg of result.packages) {
				expect(pkg.dev).toBe(true);
			}
		});

		it("adds lint and format scripts", async () => {
			const ctx = makeContext({ linterFormatter: "eslint-prettier" });
			const result = await plugin.generate(ctx);

			const scriptNames = result.scripts.map((s) => s.name);
			expect(scriptNames.some((n) => n.includes("lint") || n.includes("format"))).toBe(true);
		});

		it("does not create biome config file", async () => {
			const ctx = makeContext({ linterFormatter: "eslint-prettier" });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name.toLowerCase());
			expect(names.some((n) => n.includes("biome"))).toBe(false);
		});
	});
});
