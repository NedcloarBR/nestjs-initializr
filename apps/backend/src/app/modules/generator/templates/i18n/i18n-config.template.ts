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
  `
};
