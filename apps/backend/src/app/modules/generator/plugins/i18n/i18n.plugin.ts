import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import {
	i18nConfigIntegration,
	i18nConfigTemplate,
	i18nEnvDtoTemplate,
	i18nFileUpdates,
	i18nModuleTemplate,
	translationTemplate
} from "./templates";

/**
 * i18n Plugin - Generates nestjs-i18n module with translation support
 *
 * This plugin creates:
 * - src/modules/i18n/i18n.module.ts (I18nWrapperModule)
 * - src/modules/i18n/locales/en-US/service.json (example translations)
 * - Updates nest-cli.json with i18n assets
 * - Updates app.service.ts to use I18nService
 *
 * When config module is enabled:
 * - src/modules/i18n/i18n.config.ts (async config factory)
 * - src/modules/i18n/dtos/i18n-env.dto.ts (env validation)
 * - Updates .env with I18N_FALLBACK_LANGUAGE
 * - Updates config module with i18n integration
 */
@Plugin({
	name: "i18n",
	displayName: "i18n",
	description: "Internationalization with nestjs-i18n for multi-language support",
	priority: 400,
	dependencies: ["config"] // Optional dependency - works with or without config
})
export class I18nPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("i18n") ?? false;
	}

	protected onGenerate(): void {
		const moduleTemplate = i18nModuleTemplate(this.withConfig);
		this.createFile(moduleTemplate.name, moduleTemplate.path, moduleTemplate.content);

		this.createFile(translationTemplate.name, translationTemplate.path, translationTemplate.content);

		this.replaceInFile("", "nest-cli.json", i18nFileUpdates.nestCliJson.replacer, i18nFileUpdates.nestCliJson.content);

		this.replaceInFile(
			"src",
			"app.service.ts",
			i18nFileUpdates.appServiceImport.replacer,
			i18nFileUpdates.appServiceImport.content
		);
		this.replaceInFile(
			"src",
			"app.service.ts",
			i18nFileUpdates.appServiceConstructor.replacer,
			i18nFileUpdates.appServiceConstructor.content
		);
		this.replaceInFile(
			"src",
			"app.service.ts",
			i18nFileUpdates.appServiceMethod.replacer,
			i18nFileUpdates.appServiceMethod.content
		);

		if (this.withConfig) {
			this.setupConfigIntegration();
		}

		this.addPkg("nestjs-i18n");

		this.setConstants({
			token: null,
			import: "I18nWrapperModule",
			export: 'export { I18nWrapperModule } from "./i18n/i18n.module";',
			importArray: "I18nWrapperModule",
			inject: null,
			importIn: "src/app.module.ts"
		});
	}

	private setupConfigIntegration(): void {
		this.createFile(i18nConfigTemplate.name, i18nConfigTemplate.path, i18nConfigTemplate.content);
		this.createFile(i18nEnvDtoTemplate.name, i18nEnvDtoTemplate.path, i18nEnvDtoTemplate.content);

		this.appendToFile("", ".env", `\n${i18nConfigIntegration.dotenv.content}`);

		this.replaceInFile(
			"src/types",
			"index.d.ts",
			i18nConfigIntegration.indexDTs.replacer,
			i18nConfigIntegration.indexDTs.content
		);

		this.replaceInFile(
			"src/modules/config",
			"config.module.ts",
			i18nConfigIntegration.configModuleImport.replacer,
			i18nConfigIntegration.configModuleImport.content
		);
		this.replaceInFile(
			"src/modules/config",
			"config.module.ts",
			i18nConfigIntegration.configModuleLoad.replacer,
			i18nConfigIntegration.configModuleLoad.content
		);

		this.replaceInFile(
			"src/modules/config",
			"config.service.ts",
			i18nConfigIntegration.configServiceImport.replacer,
			i18nConfigIntegration.configServiceImport.content
		);
		this.replaceInFile(
			"src/modules/config",
			"config.service.ts",
			i18nConfigIntegration.configServiceType.replacer,
			i18nConfigIntegration.configServiceType.content
		);
	}
}
