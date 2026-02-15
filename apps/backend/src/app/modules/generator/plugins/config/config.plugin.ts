import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import {
	configIndexTemplate,
	configMainTemplate,
	configTemplates,
	dotenvExampleTemplate,
	dotenvTemplate,
	modulesIndexTemplate,
	servicesConstantTemplate
} from "./templates";

/**
 * Config Plugin - Generates the NestJS configuration module
 *
 * This plugin creates:
 * - src/modules/config/ (module, service, validator, dtos)
 * - src/constants/services.ts
 * - src/types/index.d.ts (ProcessEnv types)
 * - .env and .env.example
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
		return ctx.metadata.modules?.includes("config") ?? false;
	}

	protected onGenerate(): void {
		for (const template of configTemplates) {
			this.createFile(template.name, template.path, template.content);
		}

		this.createFile(configIndexTemplate.name, configIndexTemplate.path, configIndexTemplate.content);

		this.createFile(modulesIndexTemplate.name, modulesIndexTemplate.path, modulesIndexTemplate.content);

		this.createFile(servicesConstantTemplate.name, servicesConstantTemplate.path, servicesConstantTemplate.content);

		this.createFile(dotenvTemplate.name, dotenvTemplate.path, dotenvTemplate.content);
		this.createFile(dotenvExampleTemplate.name, dotenvExampleTemplate.path, dotenvExampleTemplate.content);

		const mainTemplate = configMainTemplate(this.mainType);
		this.createFile(mainTemplate.name, mainTemplate.path, mainTemplate.content);

		this.updateFile(
			"src",
			"app.module.ts",
			"replace",
			this.getAppModuleContent(),
			/import { Module } from "@nestjs\/common";[\s\S]*export class AppModule {}/
		);

		this.addPkg("@nestjs/config");
		this.addPkg("class-validator");
		this.addPkg("class-transformer");

		this.setConstants({
			token: "Services.Config",
			import: "ConfigModule",
			export: 'export { ConfigModule } from "./config/config.module"',
			importArray: "ConfigModule",
			inject: "@Inject(Services.Config) private readonly configService: ConfigService,",
			importIn: "src/app.module.ts"
		});
	}

	private getAppModuleContent(): string {
		return `
import { Module } from "@nestjs/common";
import { ConfigModule } from "@/modules";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
`.trim();
	}
}
