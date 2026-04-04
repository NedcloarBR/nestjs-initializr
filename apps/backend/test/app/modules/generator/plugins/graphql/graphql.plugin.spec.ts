import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { GraphQLPlugin } from "@/app/modules/generator/plugins/graphql/graphql.plugin";

describe("GraphQLPlugin", () => {
	let plugin: GraphQLPlugin;

	beforeEach(() => {
		plugin = new GraphQLPlugin();
	});

	describe("shouldActivate()", () => {
		it("returns true when graphql module is selected", () => {
			expect(plugin.shouldActivate!(makeContext({ modules: ["graphql"] }))).toBe(true);
		});

		it("returns false when graphql module is not selected", () => {
			expect(plugin.shouldActivate!(makeContext({ modules: [] }))).toBe(false);
		});
	});

	describe("generate()", () => {
		it("creates app.resolver.ts", async () => {
			const ctx = makeContext({ modules: ["graphql"] });
			const result = await plugin.generate(ctx);

			expect(result.files.map((f) => f.name)).toContain("app.resolver.ts");
		});

		it("adds core graphql packages", async () => {
			const ctx = makeContext({ modules: ["graphql"] });
			const result = await plugin.generate(ctx);

			const pkgNames = result.packages.map((p) => p.name);
			expect(pkgNames).toContain("@nestjs/graphql");
			expect(pkgNames).toContain("@nestjs/apollo");
			expect(pkgNames).toContain("@apollo/server");
			expect(pkgNames).toContain("graphql");
		});

		it("adds @as-integrations/fastify for fastify adapter", async () => {
			const ctx = makeContext({ modules: ["graphql"], mainType: "fastify" });
			const result = await plugin.generate(ctx);

			expect(result.packages.map((p) => p.name)).toContain("@as-integrations/fastify");
		});

		it("does not add @as-integrations/fastify for express adapter", async () => {
			const ctx = makeContext({ modules: ["graphql"], mainType: "express" });
			const result = await plugin.generate(ctx);

			expect(result.packages.map((p) => p.name)).not.toContain("@as-integrations/fastify");
		});

		it("adds file updates targeting app.module.ts", async () => {
			const ctx = makeContext({ modules: ["graphql"] });
			const result = await plugin.generate(ctx);

			const moduleUpdates = result.fileUpdates.filter((u) => u.fileName === "app.module.ts");
			expect(moduleUpdates.length).toBeGreaterThan(0);
		});

		it("sets constants with importArray containing GraphQL module config", async () => {
			const ctx = makeContext({ modules: ["graphql"] });
			const result = await plugin.generate(ctx);

			expect(result.constants?.importArray).toContain("GraphQLModule");
		});

		it("sets constants with importIn pointing to app.module.ts", async () => {
			const ctx = makeContext({ modules: ["graphql"] });
			const result = await plugin.generate(ctx);

			expect(result.constants?.importIn).toBe("src/app.module.ts");
		});

		it("generates no scripts", async () => {
			const ctx = makeContext({ modules: ["graphql"] });
			const result = await plugin.generate(ctx);

			expect(result.scripts).toHaveLength(0);
		});
	});
});
