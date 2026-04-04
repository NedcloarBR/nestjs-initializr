/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: <> */
import "reflect-metadata";
import { Plugin } from "@/app/common/decorators";
import { InjectPlugin } from "@/app/common/decorators/inject.decorator";
import type { PluginConstructor } from "@/app/common/interfaces";
import { BasePlugin } from "@/app/modules/generator/core/base-plugin";
import { PluginContainer } from "@/app/modules/generator/core/plugin-container";

@Plugin({ name: "alpha", displayName: "Alpha", priority: 100 })
class AlphaPlugin extends BasePlugin {
	protected onGenerate(): void {}
}

@Plugin({ name: "beta", displayName: "Beta", priority: 200 })
class BetaPlugin extends BasePlugin {
	protected onGenerate(): void {}
}

@Plugin({ name: "gamma", displayName: "Gamma", priority: 50 })
class GammaPlugin extends BasePlugin {
	protected onGenerate(): void {}
}

@Plugin({ name: "child", displayName: "Child", dependencies: ["alpha"] })
class ChildPlugin extends BasePlugin {
	public readonly injectedAlpha: AlphaPlugin;

	constructor(@InjectPlugin("alpha") alpha: AlphaPlugin) {
		super();
		this.injectedAlpha = alpha;
	}

	protected onGenerate(): void {}
}

@Plugin({ name: "conflicting", displayName: "Conflicting", conflicts: ["alpha"] })
class ConflictingPlugin extends BasePlugin {
	protected onGenerate(): void {}
}

class NotDecoratedPlugin extends BasePlugin {
	protected onGenerate(): void {}
}

describe("PluginContainer", () => {
	let container: PluginContainer;

	beforeEach(() => {
		container = new PluginContainer();
	});

	describe("register()", () => {
		it("registers a plugin successfully", () => {
			container.register(AlphaPlugin);
			expect(container.has("alpha")).toBe(true);
			expect(container.size).toBe(1);
		});

		it("throws when registering a plugin without @Plugin decorator", () => {
			expect(() => container.register(NotDecoratedPlugin)).toThrow("is not decorated with @Plugin()");
		});

		it("throws when registering the same plugin twice", () => {
			container.register(AlphaPlugin);
			expect(() => container.register(AlphaPlugin)).toThrow("already registered");
		});
	});

	describe("get()", () => {
		it("returns the registered instance by name", () => {
			container.register(AlphaPlugin);
			const instance = container.get("alpha");
			expect(instance).toBeInstanceOf(AlphaPlugin);
		});

		it("returns undefined for unknown plugin name", () => {
			expect(container.get("unknown")).toBeUndefined();
		});
	});

	describe("getByClass()", () => {
		it("returns the registered instance by class", () => {
			container.register(AlphaPlugin);
			const instance = container.getByClass(AlphaPlugin);
			expect(instance).toBeInstanceOf(AlphaPlugin);
		});

		it("returns undefined for unregistered class", () => {
			expect(container.getByClass(AlphaPlugin)).toBeUndefined();
		});
	});

	describe("has()", () => {
		it("returns true for registered plugins", () => {
			container.register(AlphaPlugin);
			expect(container.has("alpha")).toBe(true);
		});

		it("returns false for unregistered plugins", () => {
			expect(container.has("alpha")).toBe(false);
		});
	});

	describe("getAll()", () => {
		it("returns plugins sorted by priority (highest first)", () => {
			container.register(AlphaPlugin); // priority 100
			container.register(BetaPlugin); // priority 200
			container.register(GammaPlugin); // priority 50

			const all = container.getAll();
			const names = all.map((p) => container.getMetadataForInstance(p)?.name);

			expect(names).toEqual(["beta", "alpha", "gamma"]);
		});
	});

	describe("getByNames()", () => {
		it("returns only plugins matching the given names", () => {
			container.register(AlphaPlugin);
			container.register(BetaPlugin);
			container.register(GammaPlugin);

			const result = container.getByNames(["alpha", "gamma"]);
			const names = result.map((p) => container.getMetadataForInstance(p)?.name);

			expect(names).toContain("alpha");
			expect(names).toContain("gamma");
			expect(names).not.toContain("beta");
		});
	});

	describe("getMetadataForInstance()", () => {
		it("returns metadata for a registered plugin instance", () => {
			container.register(AlphaPlugin);
			const instance = container.get("alpha")!;
			const meta = container.getMetadataForInstance(instance);

			expect(meta?.name).toBe("alpha");
			expect(meta?.displayName).toBe("Alpha");
		});

		it("returns undefined for an unrelated instance", () => {
			const unrelated = new AlphaPlugin();
			container.register(AlphaPlugin);
			// The unrelated instance is NOT the same object stored by the container
			expect(container.getMetadataForInstance(unrelated)).toBeUndefined();
		});
	});

	describe("registerAll()", () => {
		it("registers multiple plugins", () => {
			container.registerAll([AlphaPlugin, BetaPlugin, GammaPlugin]);
			expect(container.size).toBe(3);
		});

		it("registers dependencies before dependents", () => {
			container.registerAll([ChildPlugin as PluginConstructor, AlphaPlugin]);

			// AlphaPlugin must be registered before ChildPlugin
			expect(container.has("alpha")).toBe(true);
			expect(container.has("child")).toBe(true);
		});

		it("throws when a required dependency is not in the list", () => {
			// ChildPlugin depends on "alpha", but AlphaPlugin is not passed
			expect(() => container.registerAll([ChildPlugin as PluginConstructor])).toThrow(
				'Cannot inject plugin "alpha" into ChildPlugin'
			);
		});
	});

	describe("dependency injection via @InjectPlugin", () => {
		it("injects the dependency plugin instance into the dependent", () => {
			container.registerAll([AlphaPlugin, ChildPlugin as PluginConstructor]);

			const child = container.get<ChildPlugin>("child")!;
			expect(child).toBeInstanceOf(ChildPlugin);
			expect(child.injectedAlpha).toBeInstanceOf(AlphaPlugin);
		});

		it("injects the same instance that was registered", () => {
			container.registerAll([AlphaPlugin, ChildPlugin as PluginConstructor]);

			const alpha = container.get<AlphaPlugin>("alpha")!;
			const child = container.get<ChildPlugin>("child")!;

			expect(child.injectedAlpha).toBe(alpha);
		});
	});

	describe("clear()", () => {
		it("removes all registered plugins", () => {
			container.register(AlphaPlugin);
			container.register(BetaPlugin);
			container.clear();

			expect(container.size).toBe(0);
			expect(container.has("alpha")).toBe(false);
		});
	});

	describe("initAll()", () => {
		it("calls onModuleInit on each plugin that defines it", async () => {
			const initMock = jest.fn();

			@Plugin({ name: "initable", displayName: "Initable" })
			class InitablePlugin extends BasePlugin {
				public onModuleInit(): void {
					initMock();
				}

				protected onGenerate(): void {}
			}

			container.register(InitablePlugin);
			await container.initAll();

			expect(initMock).toHaveBeenCalledTimes(1);
		});
	});
});
