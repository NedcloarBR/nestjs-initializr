export function i18nModuleTemplate(withConfigModule: boolean) {
	return {
		name: "i18n.module.ts",
		path: "src/modules/i18n",
		content: `
      import { Module } from "@nestjs/common";
      import { AcceptLanguageResolver, I18nModule, QueryResolver, HeaderResolver } from "nestjs-i18n";
      ${withConfigModule ? 'import { I18nConfig } from "./i18n.config"' : 'import path from "node:path";'}

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
    `
	};
}
