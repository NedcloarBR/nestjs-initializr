export function configMainTemplates(mainType: "fastify" | "express") {
	return [
		{
			replacer: 'import { AppModule } from "./app.module";',
			content:
				'import { AppModule } from "./app.module";\nimport { Services } from "./constants/services.ts"\nimport { ConfigService } from "./modules/config/config.service"'
		},
		mainType === "fastify"
			? {
					replacer: "const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());",
					content:
						"const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());\nconst configService = app.get<ConfigService>(Services.config);"
				}
			: {
					replacer: "const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());",
					content:
						"const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());\nconst configService = app.get<ConfigService>(Services.config);"
				},
		{
			replacer: 'const globalPrefix = "api";',
			content: 'const globalPrefix = configService.get("GLOBAL_PREFIX");'
		},
		{
			replacer: "const port = 3000;",
			content: 'const port = configService.get("PORT");'
		}
	];
}
