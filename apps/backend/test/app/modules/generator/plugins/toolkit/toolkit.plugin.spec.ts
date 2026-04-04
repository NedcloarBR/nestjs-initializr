import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { ToolkitPlugin } from "@/app/modules/generator/plugins/toolkit/toolkit.plugin";

describe("ToolkitPlugin", () => {
	let plugin: ToolkitPlugin;

	beforeEach(() => {
		plugin = new ToolkitPlugin();
	});

	describe("shouldActivate()", () => {
		it("returns true when toolkit module is selected", () => {
			expect(plugin.shouldActivate!(makeContext({ modules: ["toolkit"] }))).toBe(true);
		});

		it("returns false when toolkit module is not selected", () => {
			expect(plugin.shouldActivate!(makeContext({ modules: [] }))).toBe(false);
		});
	});

	describe("generate()", () => {
		it("adds @nedcloarbr/nestjs-toolkit as production dependency", async () => {
			const ctx = makeContext({ modules: ["toolkit"] });
			const result = await plugin.generate(ctx);

			const pkg = result.packages.find((p) => p.name === "@nedcloarbr/nestjs-toolkit");
			expect(pkg).toBeDefined();
			expect(pkg?.dev).toBe(false);
		});

		it("adds file updates targeting main.ts", async () => {
			const ctx = makeContext({ modules: ["toolkit"] });
			const result = await plugin.generate(ctx);

			const mainUpdates = result.fileUpdates.filter((u) => u.fileName === "main.ts");
			expect(mainUpdates.length).toBeGreaterThanOrEqual(2);
		});

		it("update content references registerHelpers", async () => {
			const ctx = makeContext({ modules: ["toolkit"] });
			const result = await plugin.generate(ctx);

			const allContent = result.fileUpdates.map((u) => u.content).join("\n");
			expect(allContent).toContain("registerHelpers");
		});

		it("generates no files directly", async () => {
			const ctx = makeContext({ modules: ["toolkit"] });
			const result = await plugin.generate(ctx);

			expect(result.files).toHaveLength(0);
		});

		it("generates no scripts", async () => {
			const ctx = makeContext({ modules: ["toolkit"] });
			const result = await plugin.generate(ctx);

			expect(result.scripts).toHaveLength(0);
		});

		it("update targets differ when config module is present", async () => {
			const ctxWith = makeContext({ modules: ["config", "toolkit"] });
			const ctxWithout = makeContext({ modules: ["toolkit"] });

			const withResult = await plugin.generate(ctxWith);
			const withoutResult = await plugin.generate(ctxWithout);

			const withSearch = withResult.fileUpdates.map((u) => String(u.searchPattern)).join("|");
			const withoutSearch = withoutResult.fileUpdates.map((u) => String(u.searchPattern)).join("|");

			expect(withSearch).not.toBe(withoutSearch);
		});
	});
});
