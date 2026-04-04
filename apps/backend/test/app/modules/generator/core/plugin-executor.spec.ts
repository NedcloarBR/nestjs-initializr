/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: <> */
import "reflect-metadata";
import { makeContext } from "@test/helpers/make-context";
import { Plugin } from "@/app/common/decorators";
import type { GeneratorContext, PluginConstructor } from "@/app/common/interfaces";
import { BasePlugin } from "@/app/modules/generator/core/base-plugin";
import { PluginContainer } from "@/app/modules/generator/core/plugin-container";
import { PluginExecutor } from "@/app/modules/generator/core/plugin-executor";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeExecutor(plugins: PluginConstructor[]): { executor: PluginExecutor; container: PluginContainer } {
	const container = new PluginContainer();
	container.registerAll(plugins);
	const executor = new PluginExecutor(container);
	return { executor, container };
}

// ---------------------------------------------------------------------------
// Test plugin fixtures
// ---------------------------------------------------------------------------

@Plugin({ name: "always-on", displayName: "Always On", priority: 100 })
class AlwaysOnPlugin extends BasePlugin {
	shouldActivate(_ctx: GeneratorContext): boolean {
		return true;
	}

	protected onGenerate(): void {
		this.createFile("always.ts", "src", "// always");
		this.addDependency("always-lib", "^1.0.0");
		this.addScript("always", "echo always");
	}
}

@Plugin({ name: "conditional", displayName: "Conditional", priority: 50 })
class ConditionalPlugin extends BasePlugin {
	protected onGenerate(): void {
		this.createFile("conditional.ts", "src", "// conditional");
	}
}

@Plugin({ name: "erroring", displayName: "Erroring", priority: 50 })
class ErroringPlugin extends BasePlugin {
	protected onGenerate(): Promise<void> {
		throw new Error("plugin exploded");
	}
}

@Plugin({ name: "before-hook", displayName: "Before Hook", priority: 50 })
class BeforeHookPlugin extends BasePlugin {
	public beforeCalled = false;

	protected async onBeforeGenerate(): Promise<void> {
		this.beforeCalled = true;
	}

	protected onGenerate(): void {}
}

@Plugin({ name: "after-hook", displayName: "After Hook", priority: 50 })
class AfterHookPlugin extends BasePlugin {
	public afterCalled = false;

	protected async onAfterGenerate(): Promise<void> {
		this.afterCalled = true;
	}

	protected onGenerate(): void {}
}

@Plugin({ name: "needs-dep", displayName: "Needs Dep", dependencies: ["missing-dep"], priority: 50 })
class NeedsDepPlugin extends BasePlugin {
	protected onGenerate(): void {}
}

@Plugin({ name: "conflict-a", displayName: "Conflict A", conflicts: ["conflict-b"], priority: 50 })
class ConflictAPlugin extends BasePlugin {
	protected onGenerate(): void {}
}

@Plugin({ name: "conflict-b", displayName: "Conflict B", priority: 50 })
class ConflictBPlugin extends BasePlugin {
	protected onGenerate(): void {}
}

@Plugin({ name: "updater", displayName: "Updater", priority: 50 })
class UpdaterPlugin extends BasePlugin {
	protected onGenerate(): void {
		this.appendToFile("src", "main.ts", "// appended");
	}
}

@Plugin({ name: "prepender", displayName: "Prepender", priority: 50 })
class PrependerPlugin extends BasePlugin {
	protected onGenerate(): void {
		this.updateFile("src", "main.ts", "prepend", "// prepended");
	}
}

@Plugin({ name: "replacer", displayName: "Replacer", priority: 50 })
class ReplacerPlugin extends BasePlugin {
	protected onGenerate(): void {
		this.replaceInFile("src", "main.ts", "REPLACE_ME", "// replaced");
	}
}

@Plugin({ name: "file-creator", displayName: "File Creator", priority: 100 })
class FileCreatorPlugin extends BasePlugin {
	shouldActivate(_ctx: GeneratorContext): boolean {
		return true;
	}

	protected onGenerate(): void {
		this.createFile("main.ts", "src", "REPLACE_ME");
	}
}

@Plugin({ name: "deduplicator", displayName: "Deduplicator", priority: 50 })
class DeduplicatorPlugin extends BasePlugin {
	protected onGenerate(): void {
		this.addDependency("shared-lib", "^1.0.0");
		this.addScript("build", "nest build");
	}
}

@Plugin({ name: "deduplicator-2", displayName: "Deduplicator 2", priority: 40 })
class Deduplicator2Plugin extends BasePlugin {
	protected onGenerate(): void {
		this.addDependency("shared-lib", "^1.0.0");
		this.addScript("build", "nest build");
	}
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("PluginExecutor", () => {
	describe("execute()", () => {
		describe("plugin activation", () => {
			it("runs plugins with shouldActivate=true regardless of moduleNames", async () => {
				const { executor } = makeExecutor([AlwaysOnPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, []);

				expect(result.success).toBe(true);
				const names = result.files.map((f) => f.name);
				expect(names).toContain("always.ts");
			});

			it("runs plugins that are in the moduleNames list", async () => {
				const { executor } = makeExecutor([ConditionalPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, ["conditional"]);

				expect(result.success).toBe(true);
				expect(result.files.map((f) => f.name)).toContain("conditional.ts");
			});

			it("does not run plugins not in moduleNames and without shouldActivate=true", async () => {
				const { executor } = makeExecutor([ConditionalPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, []);

				expect(result.success).toBe(true);
				expect(result.files.map((f) => f.name)).not.toContain("conditional.ts");
			});
		});

		describe("result aggregation", () => {
			it("aggregates files into the execution result", async () => {
				const { executor } = makeExecutor([AlwaysOnPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, []);

				expect(result.files).toHaveLength(1);
				expect(result.files[0].name).toBe("always.ts");
			});

			it("aggregates packages into the execution result", async () => {
				const { executor } = makeExecutor([AlwaysOnPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, []);

				expect(result.packages).toContainEqual({ name: "always-lib", version: "^1.0.0", dev: false });
			});

			it("aggregates scripts into the execution result", async () => {
				const { executor } = makeExecutor([AlwaysOnPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, []);

				expect(result.scripts).toContainEqual({ name: "always", command: "echo always" });
			});

			it("deduplicates packages with the same name", async () => {
				const { executor } = makeExecutor([
					DeduplicatorPlugin as PluginConstructor,
					Deduplicator2Plugin as PluginConstructor
				]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, ["deduplicator", "deduplicator-2"]);

				const sharedLibEntries = result.packages.filter((p) => p.name === "shared-lib");
				expect(sharedLibEntries).toHaveLength(1);
			});

			it("deduplicates scripts with the same name", async () => {
				const { executor } = makeExecutor([
					DeduplicatorPlugin as PluginConstructor,
					Deduplicator2Plugin as PluginConstructor
				]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, ["deduplicator", "deduplicator-2"]);

				const buildScripts = result.scripts.filter((s) => s.name === "build");
				expect(buildScripts).toHaveLength(1);
			});
		});

		describe("validation", () => {
			it("returns failure when a required dependency is not active", async () => {
				const { executor } = makeExecutor([NeedsDepPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, ["needs-dep"]);

				expect(result.success).toBe(false);
				expect(result.errors.some((e) => e.includes("missing-dep"))).toBe(true);
			});

			it("returns failure when two conflicting plugins are both active", async () => {
				const { executor } = makeExecutor([ConflictAPlugin as PluginConstructor, ConflictBPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, ["conflict-a", "conflict-b"]);

				expect(result.success).toBe(false);
				expect(result.errors.some((e) => e.includes("conflict"))).toBe(true);
			});
		});

		describe("error handling", () => {
			it("returns failure and captures error when generate throws", async () => {
				const { executor } = makeExecutor([ErroringPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, ["erroring"]);

				expect(result.success).toBe(false);
				expect(result.errors.some((e) => e.includes("generate failed"))).toBe(true);
			});
		});

		describe("lifecycle hooks", () => {
			it("calls beforeGenerate before onGenerate", async () => {
				const { executor, container } = makeExecutor([BeforeHookPlugin as PluginConstructor]);
				const ctx = makeContext();

				await executor.execute(ctx, ["before-hook"]);

				const plugin = container.get<BeforeHookPlugin>("before-hook")!;
				expect(plugin.beforeCalled).toBe(true);
			});

			it("calls afterGenerate after onGenerate", async () => {
				const { executor, container } = makeExecutor([AfterHookPlugin as PluginConstructor]);
				const ctx = makeContext();

				await executor.execute(ctx, ["after-hook"]);

				const plugin = container.get<AfterHookPlugin>("after-hook")!;
				expect(plugin.afterCalled).toBe(true);
			});
		});

		describe("file updates", () => {
			it("append action adds content after existing file content", async () => {
				const { executor } = makeExecutor([FileCreatorPlugin as PluginConstructor, UpdaterPlugin as PluginConstructor]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, ["updater"]);

				const main = result.files.find((f) => f.name === "main.ts")!;
				expect(main.content).toContain("REPLACE_ME");
				expect(main.content).toContain("// appended");
				expect(main.content.indexOf("REPLACE_ME")).toBeLessThan(main.content.indexOf("// appended"));
			});

			it("prepend action adds content before existing file content", async () => {
				const { executor } = makeExecutor([
					FileCreatorPlugin as PluginConstructor,
					PrependerPlugin as PluginConstructor
				]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, ["prepender"]);

				const main = result.files.find((f) => f.name === "main.ts")!;
				expect(main.content.indexOf("// prepended")).toBeLessThan(main.content.indexOf("REPLACE_ME"));
			});

			it("replace action substitutes matching content", async () => {
				const { executor } = makeExecutor([
					FileCreatorPlugin as PluginConstructor,
					ReplacerPlugin as PluginConstructor
				]);
				const ctx = makeContext();

				const result = await executor.execute(ctx, ["replacer"]);

				const main = result.files.find((f) => f.name === "main.ts")!;
				expect(main.content).toContain("// replaced");
				expect(main.content).not.toContain("REPLACE_ME");
			});

			it("skips file update when target file does not exist in context", async () => {
				const { executor } = makeExecutor([UpdaterPlugin as PluginConstructor]);
				const ctx = makeContext();

				// No FileCreatorPlugin registered — main.ts won't exist
				const result = await executor.execute(ctx, ["updater"]);

				expect(result.success).toBe(true);
				expect(result.files.map((f) => f.name)).not.toContain("main.ts");
			});
		});

		describe("module injection via constants", () => {
			it("appends export to barrel file when constants.export is set", async () => {
				@Plugin({ name: "exporter", displayName: "Exporter", priority: 50 })
				class ExporterPlugin extends BasePlugin {
					protected onGenerate(): void {
						this.setConstants({
							export: 'export { MyModule } from "./my/my.module";',
							importIn: "src/app.module.ts"
						});
					}
				}

				const { executor } = makeExecutor([ExporterPlugin as PluginConstructor]);
				const ctx = makeContext();

				// Pre-populate the barrel file so the executor can update it
				ctx.files.set("src/modules/index.ts", {
					path: "src/modules",
					name: "index.ts",
					content: ""
				});

				await executor.execute(ctx, ["exporter"]);

				const barrel = ctx.files.get("src/modules/index.ts")!;
				expect(barrel.content).toContain("export { MyModule }");
			});

			it("injects module into AppModule imports array", async () => {
				@Plugin({ name: "injector", displayName: "Injector", priority: 50 })
				class InjectorPlugin extends BasePlugin {
					protected onGenerate(): void {
						this.setConstants({
							import: "MyModule",
							importArray: "MyModule",
							importIn: "src/app.module.ts"
						});
					}
				}

				const { executor } = makeExecutor([InjectorPlugin as PluginConstructor]);
				const ctx = makeContext();

				ctx.files.set("src/app.module.ts", {
					path: "src",
					name: "app.module.ts",
					content: `import { Module } from '@nestjs/common';
@Module({
  imports: [],
})
export class AppModule {}`
				});

				await executor.execute(ctx, ["injector"]);

				const appModule = ctx.files.get("src/app.module.ts")!;
				expect(appModule.content).toContain("MyModule");
			});
		});
	});
});
