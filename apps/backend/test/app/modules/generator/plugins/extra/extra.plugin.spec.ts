import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { ExtraPlugin } from "@/app/modules/generator/plugins/extra/extra.plugin";

describe("ExtraPlugin", () => {
	let plugin: ExtraPlugin;

	beforeEach(() => {
		plugin = new ExtraPlugin();
	});

	describe("shouldActivate()", () => {
		it("returns true when at least one extra is selected", () => {
			expect(plugin.shouldActivate!(makeContext({ extras: ["cors"] }))).toBe(true);
		});

		it("returns false when extras list is empty", () => {
			expect(plugin.shouldActivate!(makeContext({ extras: [] }))).toBe(false);
		});

		it("returns false when extras is not set", () => {
			expect(plugin.shouldActivate!(makeContext())).toBe(false);
		});
	});

	describe("helmet", () => {
		it("adds @fastify/helmet for fastify", async () => {
			const ctx = makeContext({ extras: ["helmet"], mainType: "fastify" });
			const result = await plugin.generate(ctx);

			expect(result.packages.map((p) => p.name)).toContain("@fastify/helmet");
		});

		it("adds helmet for express", async () => {
			const ctx = makeContext({ extras: ["helmet"], mainType: "express" });
			const result = await plugin.generate(ctx);

			expect(result.packages.map((p) => p.name)).toContain("helmet");
		});

		it("adds file updates targeting main.ts", async () => {
			const ctx = makeContext({ extras: ["helmet"] });
			const result = await plugin.generate(ctx);

			const mainUpdates = result.fileUpdates.filter((u) => u.fileName === "main.ts");
			expect(mainUpdates.length).toBeGreaterThan(0);
		});
	});

	describe("compression", () => {
		it("adds @fastify/compress for fastify", async () => {
			const ctx = makeContext({ extras: ["compression"], mainType: "fastify" });
			const result = await plugin.generate(ctx);

			expect(result.packages.map((p) => p.name)).toContain("@fastify/compress");
		});

		it("adds compression for express", async () => {
			const ctx = makeContext({ extras: ["compression"], mainType: "express" });
			const result = await plugin.generate(ctx);

			expect(result.packages.map((p) => p.name)).toContain("compression");
		});

		it("adds file updates targeting main.ts", async () => {
			const ctx = makeContext({ extras: ["compression"] });
			const result = await plugin.generate(ctx);

			const mainUpdates = result.fileUpdates.filter((u) => u.fileName === "main.ts");
			expect(mainUpdates.length).toBeGreaterThan(0);
		});
	});

	describe("validation", () => {
		it("adds class-validator and class-transformer packages", async () => {
			const ctx = makeContext({ extras: ["validation"] });
			const result = await plugin.generate(ctx);

			const pkgNames = result.packages.map((p) => p.name);
			expect(pkgNames).toContain("class-validator");
			expect(pkgNames).toContain("class-transformer");
		});

		it("adds file updates targeting main.ts", async () => {
			const ctx = makeContext({ extras: ["validation"] });
			const result = await plugin.generate(ctx);

			const mainUpdates = result.fileUpdates.filter((u) => u.fileName === "main.ts");
			expect(mainUpdates.length).toBeGreaterThan(0);
		});
	});

	describe("cors", () => {
		it("adds a file update targeting main.ts", async () => {
			const ctx = makeContext({ extras: ["cors"] });
			const result = await plugin.generate(ctx);

			const mainUpdates = result.fileUpdates.filter((u) => u.fileName === "main.ts");
			expect(mainUpdates.length).toBeGreaterThan(0);
		});

		it("does not add any packages", async () => {
			const ctx = makeContext({ extras: ["cors"] });
			const result = await plugin.generate(ctx);

			expect(result.packages).toHaveLength(0);
		});
	});

	describe("multiple extras together", () => {
		it("handles all extras selected at once", async () => {
			const ctx = makeContext({ extras: ["cors", "helmet", "compression", "validation"] });
			const result = await plugin.generate(ctx);

			const pkgNames = result.packages.map((p) => p.name);
			expect(pkgNames).toContain("@fastify/helmet");
			expect(pkgNames).toContain("@fastify/compress");
			expect(pkgNames).toContain("class-validator");
		});
	});
});
