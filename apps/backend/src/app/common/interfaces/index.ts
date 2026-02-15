export type { MetadataDTO } from "@/app/modules/generator/dtos/metadata.dto";
export type { ExtraNames, ModuleNames, ModuleTemplate, Template } from "@/types";
export { createContext, type GeneratorContext } from "./generator-context.interface";
export type {
	FileUpdate,
	GeneratedFile,
	IGeneratorPlugin,
	PackageDependency,
	PluginConstants,
	PluginConstructor,
	PluginResult,
	Script
} from "./generator-plugin.interface";
