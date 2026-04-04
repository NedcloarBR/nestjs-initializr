import type { GeneratorContext } from "@/app/common/interfaces";
import { createContext } from "@/app/common/interfaces";

export function makeContext(overrides: Partial<GeneratorContext["metadata"]> = {}): GeneratorContext {
	return createContext("test-id", {
		mainType: "fastify",
		packageManager: "yarn",
		packageJson: {
			name: "my-app",
			nodeVersion: "20"
		},
		modules: [],
		extras: [],
		...overrides
	} as GeneratorContext["metadata"]);
}
