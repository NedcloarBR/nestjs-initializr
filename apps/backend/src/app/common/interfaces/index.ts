export {
	type IGeneratorPlugin,
	type PluginResult,
	type GeneratedFile,
	type PackageDependency,
	type Script,
	type FileUpdate,
	type PluginConstants,
	type PluginConstructor
} from "./generator-plugin.interface";

export { type GeneratorContext, createContext } from "./generator-context.interface";

// Re-export existing types for convenience
export type { MetadataDTO } from "@/app/modules/generator/dtos/metadata.dto";
export type { ModuleNames, ExtraNames, Template, ModuleTemplate } from "@/types";
