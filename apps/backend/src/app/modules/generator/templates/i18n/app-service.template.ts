export const appServiceTemplate = {
	name: "app.service.ts",
	path: "src",
	templates: [
		{
			replacer: 'import { Injectable } from "@nestjs/common";',
			content: 'import { Injectable } from "@nestjs/common";\nimport { I18nContext, I18nService } from "nestjs-i18n";'
		},
		{
			replacer: "export class AppService {",
			content: "export class AppService {\npublic constructor(private readonly i18n: I18nService) {}\n"
		},
		{
			replacer: 'return "Hello World!";',
			content: 'return this.i18n.t("service.hello", { lang: I18nContext.current().lang });'
		}
	]
};
