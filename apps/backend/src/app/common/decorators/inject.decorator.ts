import "reflect-metadata";

export const INJECT_METADATA = Symbol("INJECT_METADATA");

/**
 * Decorator to inject dependencies into plugins
 * Similar to @Inject() in NestJS
 *
 * @example
 * ```typescript
 * @Plugin({ name: "i18n", ... })
 * export class I18nPlugin {
 *   constructor(
 *     @InjectPlugin("config") private configPlugin: ConfigPlugin
 *   ) {}
 * }
 * ```
 */
export function InjectPlugin(pluginName: string): ParameterDecorator {
	return (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
		const existingInjections: Map<number, string> =
			Reflect.getMetadata(INJECT_METADATA, target) || new Map<number, string>();

		existingInjections.set(parameterIndex, pluginName);
		Reflect.defineMetadata(INJECT_METADATA, existingInjections, target);
	};
}

/**
 * Get injection metadata from a decorated class
 */
export function getInjectMetadata(target: object): Map<number, string> {
	return Reflect.getMetadata(INJECT_METADATA, target) || new Map<number, string>();
}
