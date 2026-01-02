import type { MetadataDTO } from "@/app/modules/generator/dtos/metadata.dto";
import type { GeneratedFile, PackageDependency, Script } from "./generator-plugin.interface";

/**
 * Shared context passed to all plugins during generation
 * Acts as a shared state container
 *
 * Reutiliza o MetadataDTO existente
 */
export interface GeneratorContext {
	/**
	 * Unique identifier for this generation
	 */
	readonly id: string;

	/**
	 * Generation metadata/options (uses existing MetadataDTO)
	 */
	readonly metadata: MetadataDTO;

	/**
	 * Generated files map (path/name -> file)
	 */
	readonly files: Map<string, GeneratedFile>;

	/**
	 * Collected package dependencies
	 */
	readonly packages: PackageDependency[];

	/**
	 * Collected npm scripts
	 */
	readonly scripts: Script[];

	/**
	 * Shared state for inter-plugin communication
	 */
	readonly state: Map<string, unknown>;
}

/**
 * Factory function to create a new generator context
 */
export function createContext(id: string, metadata: MetadataDTO): GeneratorContext {
	return {
		id,
		metadata,
		files: new Map(),
		packages: [],
		scripts: [],
		state: new Map()
	};
}
