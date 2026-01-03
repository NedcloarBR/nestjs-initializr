/**
 * i18n templates - Generates nestjs-i18n module with translation support
 */

export function i18nModuleTemplate(withConfigModule: boolean) {
	return {
		name: "i18n.module.ts",
		path: "src/modules/i18n",
		content: `
import { Module } from "@nestjs/common";
import { AcceptLanguageResolver, I18nModule, QueryResolver, HeaderResolver } from "nestjs-i18n";
${withConfigModule ? 'import { I18nConfig } from "./i18n.config";' : 'import path from "node:path";'}

@Module({
  imports: [
    I18nModule.${
			withConfigModule
				? `forRootAsync({
      useClass: I18nConfig,
      resolvers: [
        { use: QueryResolver, options: ["lang", "locale", "language"] },
        AcceptLanguageResolver,
        new HeaderResolver(["x-lang", "x-locale", "x-language"]),
      ],
    })`
				: `forRoot({
      fallbackLanguage: "en-US",
      loaderOptions: {
        path: path.join(__dirname, "/locales/"),
        watch: true
      },
      resolvers: [
        { use: QueryResolver, options: ["lang", "locale", "language"] },
        AcceptLanguageResolver,
        new HeaderResolver(["x-lang", "x-locale", "x-language"]),
      ],
    })`
		}
  ]
})
export class I18nWrapperModule {}
`.trim()
	};
}

export const i18nConfigTemplate = {
	name: "i18n.config.ts",
	path: "src/modules/i18n",
	content: `
import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@/modules/config/config.service";
import { Services } from "@/constants/services";
import type {
  I18nOptionsFactory,
  I18nOptionsWithoutResolvers,
} from "nestjs-i18n";
import path from "node:path";

@Injectable()
export class I18nConfig implements I18nOptionsFactory {
  public constructor(@Inject(Services.Config) private config: ConfigService) {}

  public createI18nOptions(): I18nOptionsWithoutResolvers {
    return {
      fallbackLanguage: this.config.get("I18N_FALLBACK_LANGUAGE"),
      loaderOptions: {
        path: path.join(__dirname, "/locales/"),
        watch: true,
      },
    };
  }
}
`.trim()
};

export const i18nEnvDtoTemplate = {
	name: "i18n-env.dto.ts",
	path: "src/modules/i18n/dtos",
	content: `
import { registerAs } from "@nestjs/config";
import { IsString, IsNotEmpty } from "class-validator";
import validateConfig from "@/modules/config/config.validator";

export class I18nEnvDTO {
  @IsString()
  @IsNotEmpty()
  public readonly I18N_FALLBACK_LANGUAGE!: string;
}

export default registerAs("i18n_env", () => {
  validateConfig(process.env, I18nEnvDTO);

  return {
    I18N_FALLBACK_LANGUAGE: process.env.I18N_FALLBACK_LANGUAGE || "en-US",
  };
});
`.trim()
};

export const translationTemplate = {
	name: "service.json",
	path: "src/modules/i18n/locales/en-US",
	content: `
{
  "hello": "Hello, World!"
}
`.trim()
};

export const i18nFileUpdates = {
	nestCliJson: {
		replacer: '"compilerOptions": {',
		content: '"compilerOptions": { "assets": [{ "include": "modules/i18n/locales/**/*", "watchAssets": true }],'
	},
	appServiceImport: {
		replacer: 'import { Injectable } from "@nestjs/common";',
		content: 'import { Injectable } from "@nestjs/common";\nimport { I18nContext, I18nService } from "nestjs-i18n";'
	},
	appServiceConstructor: {
		replacer: "export class AppService {",
		content: "export class AppService {\n  public constructor(private readonly i18n: I18nService) {}"
	},
	appServiceMethod: {
		replacer: 'return "Hello World!";',
		content: 'return this.i18n.t("service.hello", { lang: I18nContext.current().lang });'
	}
};

// Config module integration updates
export const i18nConfigIntegration = {
	dotenv: {
		content: "I18N_FALLBACK_LANGUAGE=en-US"
	},
	indexDTs: {
		replacer: "GLOBAL_PREFIX: string;",
		content: "GLOBAL_PREFIX: string;\n    I18N_FALLBACK_LANGUAGE: string;"
	},
	configModuleImport: {
		replacer: 'import EnvConfig from "./dtos/env.dto"',
		content: 'import EnvConfig from "./dtos/env.dto";\nimport I18nEnvDTO from "@/modules/i18n/dtos/i18n-env.dto";'
	},
	configModuleLoad: {
		replacer: "load: [EnvConfig",
		content: "load: [EnvConfig, I18nEnvDTO"
	},
	configServiceImport: {
		replacer: 'import { EnvDTO } from "./dtos/env.dto";',
		content: 'import { EnvDTO } from "./dtos/env.dto";\nimport { I18nEnvDTO } from "@/modules/i18n/dtos/i18n-env.dto";'
	},
	configServiceType: {
		replacer: "InstanceType<typeof EnvDTO>",
		content: "InstanceType<typeof EnvDTO> & InstanceType<typeof I18nEnvDTO>"
	}
};
