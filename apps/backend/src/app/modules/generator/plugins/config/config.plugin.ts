import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { configMainTemplate, configTemplates, dotenvTemplate } from "./templates";

/**
 * Config Plugin - Generates the NestJS configuration module
 *
 * This plugin creates:
 * - src/modules/config/ (module, service, validator, dtos)
 * - src/constants/services.ts
 * - src/types/index.d.ts (ProcessEnv types)
 * - .env file
 * - Updates main.ts to use ConfigService
 */
@Plugin({
	name: "config",
	displayName: "Config Module",
	description: "Configuration module with @nestjs/config, environment validation, and typed config service",
	priority: 900
})
export class ConfigPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("config");
	}

	protected onGenerate(): void {
		for (const template of configTemplates) {
			this.createFile(template.name, template.path, template.content);
		}

		this.replaceInFile("src/constants", "services.ts", "});", `  Config: Symbol("CONFIG_SERVICE"),\n});`);

		this.appendToFile(dotenvTemplate.name, dotenvTemplate.path, dotenvTemplate.content);

		const mainTemplate = configMainTemplate(this.mainType);
		this.createFile(mainTemplate.name, mainTemplate.path, mainTemplate.content);

		this.addPkg("@nestjs/config");
		this.addPkg("class-validator");
		this.addPkg("class-transformer");

		this.setConstants({
			token: "Services.Config",
			import: "ConfigModuleWrapper",
			export: 'export { ConfigModuleWrapper } from "./config/config.module";',
			importArray: "ConfigModuleWrapper",
			inject: "@Inject(Services.Config) private readonly configService: ConfigService,",
			importIn: "src/app.module.ts"
		});
	}
}
