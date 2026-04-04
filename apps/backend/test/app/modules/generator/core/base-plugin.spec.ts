import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { DEV_NPM_DEPENDENCIES, NPM_DEPENDENCIES } from "@/app/constants/packages";
import { BasePlugin } from "@/app/modules/generator/core/base-plugin";

class TestPlugin extends BasePlugin {
	// biome-ignore lint/suspicious/noEmptyBlockStatements: <>
	private _generateFn: () => void = () => {};

	public setGenerateFn(fn: () => void): void {
		this._generateFn = fn;
	}

	protected onGenerate(): void {
		this._generateFn();
	}

	// Expose protected methods
	public exposeCreateFile(name: string, path: string, content: string): void {
		this.createFile(name, path, content);
	}

	public exposeAddDependency(name: string, version: string, dev?: boolean): void {
		this.addDependency(name, version, dev);
	}

	public exposeAddDevDependency(name: string, version: string): void {
		this.addDevDependency(name, version);
	}

	public exposeAddPkg(name: keyof typeof NPM_DEPENDENCIES): void {
		this.addPkg(name);
	}

	public exposeAddDevPkg(name: keyof typeof DEV_NPM_DEPENDENCIES): void {
		this.addDevPkg(name);
	}

	public exposeAddScript(name: string, command: string): void {
		this.addScript(name, command);
	}

	public exposeSetState<T>(key: string, value: T): void {
		this.setState(key, value);
	}

	public exposeGetState<T>(key: string): T | undefined {
		return this.getState<T>(key);
	}

	public exposeHasState(key: string): boolean {
		return this.hasState(key);
	}

	public exposeHasModule(name: Parameters<typeof this.hasModule>[0]): boolean {
		return this.hasModule(name);
	}

	public exposeHasExtra(name: Parameters<typeof this.hasExtra>[0]): boolean {
		return this.hasExtra(name);
	}

	public get exposedIsFastify(): boolean {
		return this.isFastify;
	}

	public get exposedIsExpress(): boolean {
		return this.isExpress;
	}

	public get exposedPackageManager(): string {
		return this.packageManager;
	}

	public get exposedProjectName(): string {
		return this.projectName;
	}

	public get exposedProjectDescription(): string {
		return this.projectDescription;
	}

	public get exposedNodeVersion(): string {
		return this.nodeVersion;
	}

	public get exposedLinterFormatter(): string | undefined {
		return this.linterFormatter;
	}

	public get exposedTestRunner(): string | undefined {
		return this.testRunner;
	}

	public get exposedWithDocker(): boolean {
		return this.withDocker;
	}

	public get exposedWithConfig(): boolean {
		return this.withConfig;
	}
}

describe("BasePlugin", () => {
	let plugin: TestPlugin;

	beforeEach(() => {
		plugin = new TestPlugin();
	});

	describe("generate()", () => {
		it("returns empty result when onGenerate does nothing", async () => {
			const ctx = makeContext();
			const result = await plugin.generate(ctx);

			expect(result.files).toEqual([]);
			expect(result.packages).toEqual([]);
			expect(result.scripts).toEqual([]);
			expect(result.fileUpdates).toEqual([]);
			expect(result.constants).toBeUndefined();
			expect(result.rootFolders).toEqual([]);
		});

		it("resets state between successive generate calls", async () => {
			const ctx = makeContext();

			plugin.setGenerateFn(() => {
				plugin.exposeCreateFile("file.ts", "src", "content");
			});
			await plugin.generate(ctx);

			// biome-ignore lint/suspicious/noEmptyBlockStatements: <>
			plugin.setGenerateFn(() => {});
			const result = await plugin.generate(ctx);

			expect(result.files).toEqual([]);
		});
	});

	describe("createFile()", () => {
		it("adds a file to the result", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeCreateFile("app.module.ts", "src", "// content");
			});

			const result = await plugin.generate(ctx);

			expect(result.files).toHaveLength(1);
			expect(result.files[0]).toEqual({
				name: "app.module.ts",
				path: "src",
				content: "// content"
			});
		});

		it("trims whitespace from content", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeCreateFile("file.ts", "src", "  trimmed  ");
			});

			const { files } = await plugin.generate(ctx);
			expect(files[0].content).toBe("trimmed");
		});

		it("adds multiple files", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeCreateFile("a.ts", "src", "a");
				plugin.exposeCreateFile("b.ts", "src", "b");
			});

			const { files } = await plugin.generate(ctx);
			expect(files).toHaveLength(2);
		});
	});

	describe("addDependency()", () => {
		it("adds a production dependency", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeAddDependency("some-lib", "^1.0.0");
			});

			const { packages } = await plugin.generate(ctx);
			expect(packages).toContainEqual({ name: "some-lib", version: "^1.0.0", dev: false });
		});

		it("adds a dev dependency when dev=true", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeAddDependency("some-dev-lib", "^2.0.0", true);
			});

			const { packages } = await plugin.generate(ctx);
			expect(packages).toContainEqual({ name: "some-dev-lib", version: "^2.0.0", dev: true });
		});
	});

	describe("addDevDependency()", () => {
		it("adds a dev dependency", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeAddDevDependency("@types/node", "^20.0.0");
			});

			const { packages } = await plugin.generate(ctx);
			expect(packages).toContainEqual({ name: "@types/node", version: "^20.0.0", dev: true });
		});
	});

	describe("addPkg()", () => {
		it("resolves version from NPM_DEPENDENCIES", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeAddPkg("@nestjs/config");
			});

			const { packages } = await plugin.generate(ctx);
			expect(packages).toContainEqual({
				name: NPM_DEPENDENCIES["@nestjs/config"].name,
				version: NPM_DEPENDENCIES["@nestjs/config"].version,
				dev: false
			});
		});
	});

	describe("addDevPkg()", () => {
		it("resolves version from DEV_NPM_DEPENDENCIES", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeAddDevPkg("husky");
			});

			const { packages } = await plugin.generate(ctx);
			expect(packages).toContainEqual({
				name: DEV_NPM_DEPENDENCIES["husky"].name,
				version: DEV_NPM_DEPENDENCIES["husky"].version,
				dev: true
			});
		});
	});

	describe("addScript()", () => {
		it("adds a script to the result", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeAddScript("build", "nest build");
			});

			const { scripts } = await plugin.generate(ctx);
			expect(scripts).toContainEqual({ name: "build", command: "nest build" });
		});
	});

	describe("state management", () => {
		it("sets and gets a value from context state", async () => {
			const ctx = makeContext();
			plugin.setGenerateFn(() => {
				plugin.exposeSetState("myKey", { foo: "bar" });
			});
			await plugin.generate(ctx);

			expect(ctx.state.get("myKey")).toEqual({ foo: "bar" });
		});

		it("getState() reads from context state", async () => {
			const ctx = makeContext();
			ctx.state.set("existing", 42);

			plugin.setGenerateFn(() => {
				const val = plugin.exposeGetState<number>("existing");
				plugin.exposeAddScript("result", String(val));
			});

			const { scripts } = await plugin.generate(ctx);
			expect(scripts[0].command).toBe("42");
		});

		it("hasState() returns true for existing key", async () => {
			const ctx = makeContext();
			ctx.state.set("present", true);
			let result = false;

			plugin.setGenerateFn(() => {
				result = plugin.exposeHasState("present");
			});
			await plugin.generate(ctx);

			expect(result).toBe(true);
		});

		it("hasState() returns false for missing key", async () => {
			const ctx = makeContext();
			let result = true;

			plugin.setGenerateFn(() => {
				result = plugin.exposeHasState("absent");
			});
			await plugin.generate(ctx);

			expect(result).toBe(false);
		});
	});

	describe("hasModule()", () => {
		it("returns true when module is present", async () => {
			const ctx = makeContext({ modules: ["config"] });
			await plugin.generate(ctx);
			expect(plugin.exposeHasModule("config")).toBe(true);
		});

		it("returns false when module is absent", async () => {
			const ctx = makeContext({ modules: [] });
			await plugin.generate(ctx);
			expect(plugin.exposeHasModule("config")).toBe(false);
		});
	});

	describe("hasExtra()", () => {
		it("returns true when extra is present", async () => {
			const ctx = makeContext({ extras: ["cors"] });
			await plugin.generate(ctx);
			expect(plugin.exposeHasExtra("cors")).toBe(true);
		});

		it("returns false when extra is absent", async () => {
			const ctx = makeContext({ extras: [] });
			await plugin.generate(ctx);
			expect(plugin.exposeHasExtra("cors")).toBe(false);
		});
	});

	describe("context getters", () => {
		it("isFastify returns true for fastify mainType", async () => {
			const ctx = makeContext({ mainType: "fastify" });
			await plugin.generate(ctx);
			expect(plugin.exposedIsFastify).toBe(true);
			expect(plugin.exposedIsExpress).toBe(false);
		});

		it("isExpress returns true for express mainType", async () => {
			const ctx = makeContext({ mainType: "express" });
			await plugin.generate(ctx);
			expect(plugin.exposedIsExpress).toBe(true);
			expect(plugin.exposedIsFastify).toBe(false);
		});

		it("packageManager returns the correct value", async () => {
			const ctx = makeContext({ packageManager: "pnpm" });
			await plugin.generate(ctx);
			expect(plugin.exposedPackageManager).toBe("pnpm");
		});

		it("projectName returns the package name", async () => {
			const ctx = makeContext({ packageJson: { name: "cool-project", nodeVersion: "20" } });
			await plugin.generate(ctx);
			expect(plugin.exposedProjectName).toBe("cool-project");
		});

		it("nodeVersion returns the node version", async () => {
			const ctx = makeContext({ packageJson: { name: "app", nodeVersion: "22" } });
			await plugin.generate(ctx);
			expect(plugin.exposedNodeVersion).toBe("22");
		});

		it("linterFormatter returns the selected linter", async () => {
			const ctx = makeContext({ linterFormatter: "biome" });
			await plugin.generate(ctx);
			expect(plugin.exposedLinterFormatter).toBe("biome");
		});

		it("testRunner returns the selected test runner", async () => {
			const ctx = makeContext({ testRunner: "vitest" });
			await plugin.generate(ctx);
			expect(plugin.exposedTestRunner).toBe("vitest");
		});

		it("withDocker returns true when docker is enabled", async () => {
			const ctx = makeContext({ docker: true });
			await plugin.generate(ctx);
			expect(plugin.exposedWithDocker).toBe(true);
		});

		it("withConfig returns true when config module is selected", async () => {
			const ctx = makeContext({ modules: ["config"] });
			await plugin.generate(ctx);
			expect(plugin.exposedWithConfig).toBe(true);
		});
	});
});
