export type { MetadataDTO } from "@/app/modules/generator/dtos/metadata.dto";
export type { ExtraNames, ModuleNames, ModuleTemplate, Template } from "@/types";
export { createContext, type GeneratorContext } from "./generator-context.interface";
export {
	type FileUpdate,
	type GeneratedFile,
	type IGeneratorPlugin,
	type PackageDependency,
	type PluginConstants,
	type PluginConstructor,
	type PluginResult,
	type Script
} from "./generator-plugin.interface";
