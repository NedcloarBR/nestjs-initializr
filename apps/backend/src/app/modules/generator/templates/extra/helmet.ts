export function helmet(mainType: "fastify" | "express", withConfigModule: boolean) {
	return [
		{
			replacer: 'import { NestFactory } from "@nestjs/core";',
			content: `import { NestFactory } from "@nestjs/core";\nimport helmet from ${mainType === "fastify" ? "@fastify/helmet" : "helmet"};`
		},
		{
			replacer: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};`,
			content: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};\n${mainType === "fastify" ? "await app.register(helmet)" : "app.use(helmet())"}`
		}
	];
}
