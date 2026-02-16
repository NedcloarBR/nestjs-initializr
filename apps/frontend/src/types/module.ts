import type { ModuleName } from "@/constants/modules";

export type ModuleType = {
	title: string;
	name: ModuleName;
	descriptionKey: string;
	iconType: "svg" | "png";
	dependsOn?: ModuleName | ModuleName[];
	conflicts?: ModuleName | ModuleName[];
	category: ModuleCategory;
};

export enum ModuleCategory {
	LINTER_FORMATTER = "linter-formatter",
	TEST_RUNNER = "test-runner",
	CONFIG = "config",
	DOCUMENTATION = "documentation",
	UTILITY = "utility",
	INFRA = "infra",
	DATABASE = "database"
}

export type Dependency = { type: "AND"; modules: ModuleName[] } | { type: "OR"; modules: ModuleName[] };
