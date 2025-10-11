export interface ConfigStructure {
	packageJson: {
		name: string;
		description: string;
		nodeVersion: "20" | "21" | "22" | "23";
	};
	mainType: "fastify" | "express";
	packageManager: "npm" | "yarn" | "pnpm";
	modules: string[];
	extras: string[];
	linterFormatter: "biome" | "eslint-prettier";
	docker: boolean;
	testRunner: "jest" | "vitest";
	extraPackages: { name: string; version: string; dev: boolean }[];
}
