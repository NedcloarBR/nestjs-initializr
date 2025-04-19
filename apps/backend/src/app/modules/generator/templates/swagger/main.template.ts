export function swaggerMainTemplate(withConfigModule: boolean) {
	return [
		{
			replacer: 'import { AppModule } from "./app.module";',
			content: 'import { AppModule } from "./app.module";\nimport { setupSwagger } from "./lib";'
		},
		{
			replacer: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};`,
			content: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};\nsetupSwagger(app, globalPrefix, port);`
		}
	];
}
