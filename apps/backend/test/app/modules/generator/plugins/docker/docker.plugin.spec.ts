import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { DockerPlugin } from "@/app/modules/generator/plugins/docker/docker.plugin";

describe("DockerPlugin", () => {
	let plugin: DockerPlugin;

	beforeEach(() => {
		plugin = new DockerPlugin();
	});

	describe("shouldActivate()", () => {
		it("returns true when docker is enabled", () => {
			const ctx = makeContext({ docker: true });
			expect(plugin.shouldActivate!(ctx)).toBe(true);
		});

		it("returns false when docker is disabled", () => {
			const ctx = makeContext({ docker: false });
			expect(plugin.shouldActivate!(ctx)).toBe(false);
		});
	});

	describe("generate()", () => {
		it("generates Dockerfile, docker-compose.yml and .dockerignore", async () => {
			const ctx = makeContext({ docker: true });
			const result = await plugin.generate(ctx);

			const names = result.files.map((f) => f.name);
			expect(names).toContain("Dockerfile");
			expect(names).toContain("docker-compose.yml");
			expect(names).toContain(".dockerignore");
		});

		it("Dockerfile content includes the node version", async () => {
			const ctx = makeContext({ docker: true, packageJson: { name: "app", nodeVersion: "22" } });
			const result = await plugin.generate(ctx);

			const dockerfile = result.files.find((f) => f.name === "Dockerfile")!;
			expect(dockerfile.content).toContain("22");
		});

		it("docker-compose.yml content includes the project name", async () => {
			const ctx = makeContext({ docker: true, packageJson: { name: "awesome-api", nodeVersion: "20" } });
			const result = await plugin.generate(ctx);

			const compose = result.files.find((f) => f.name === "docker-compose.yml")!;
			expect(compose.content).toContain("awesome-api");
		});

		it("Dockerfile content references the correct package manager install command", async () => {
			const ctx = makeContext({ docker: true, packageManager: "pnpm" });
			const result = await plugin.generate(ctx);

			const dockerfile = result.files.find((f) => f.name === "Dockerfile")!;
			expect(dockerfile.content).toContain("pnpm");
		});

		it("generates no packages or scripts", async () => {
			const ctx = makeContext({ docker: true });
			const result = await plugin.generate(ctx);

			expect(result.packages).toHaveLength(0);
			expect(result.scripts).toHaveLength(0);
		});
	});
});
