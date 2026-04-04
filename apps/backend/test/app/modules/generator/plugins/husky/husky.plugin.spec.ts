import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { HuskyPlugin } from "@/app/modules/generator/plugins/husky/husky.plugin";

describe("HuskyPlugin", () => {
	let plugin: HuskyPlugin;

	beforeEach(() => {
		plugin = new HuskyPlugin();
	});

	describe("shouldActivate()", () => {
		it("returns true when husky module is selected", () => {
			const ctx = makeContext({ modules: ["husky"] });
			expect(plugin.shouldActivate!(ctx)).toBe(true);
		});

		it("returns false when husky module is not selected", () => {
			const ctx = makeContext({ modules: [] });
			expect(plugin.shouldActivate!(ctx)).toBe(false);
		});
	});

	describe("generate()", () => {
		it("creates pre-commit and commit-msg hooks", async () => {
			const ctx = makeContext({ modules: ["husky"] });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names).toContain("pre-commit");
			expect(names).toContain("commit-msg");
		});

		it("creates commitlint and lint-staged config files", async () => {
			const ctx = makeContext({ modules: ["husky"] });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names).toContain(".commitlintrc.json");
			expect(names).toContain(".lintstagedrc");
		});

		it("adds required dev dependencies", async () => {
			const ctx = makeContext({ modules: ["husky"] });
			const result = await plugin.generate(ctx);

			const pkgNames = result.packages.map((p) => p.name);
			expect(pkgNames).toContain("husky");
			expect(pkgNames).toContain("lint-staged");
			expect(pkgNames).toContain("@commitlint/cli");
			expect(pkgNames).toContain("@commitlint/config-angular");
		});

		it("all added packages are dev dependencies", async () => {
			const ctx = makeContext({ modules: ["husky"] });
			const result = await plugin.generate(ctx);

			for (const pkg of result.packages) {
				expect(pkg.dev).toBe(true);
			}
		});

		it("adds the prepare script", async () => {
			const ctx = makeContext({ modules: ["husky"] });
			const result = await plugin.generate(ctx);

			expect(result.scripts).toContainEqual({ name: "prepare", command: "husky" });
		});

		it("pre-commit hook content references the package manager", async () => {
			const ctx = makeContext({ modules: ["husky"], packageManager: "pnpm" });
			const result = await plugin.generate(ctx);

			const preCommit = result.files.find((f) => f.name === "pre-commit")!;
			expect(preCommit.content).toContain("pnpm");
		});

		it(".lintstagedrc content reflects biome when biome is selected", async () => {
			const ctx = makeContext({ modules: ["husky"], linterFormatter: "biome" });
			const result = await plugin.generate(ctx);

			const lintStaged = result.files.find((f) => f.name === ".lintstagedrc")!;
			expect(lintStaged.content).toContain("biome");
		});

		it(".lintstagedrc content reflects eslint-prettier when selected", async () => {
			const ctx = makeContext({ modules: ["husky"], linterFormatter: "eslint-prettier" });
			const result = await plugin.generate(ctx);

			const lintStaged = result.files.find((f) => f.name === ".lintstagedrc")!;
			expect(lintStaged.content).toMatch(/eslint|prettier/i);
		});
	});
});
