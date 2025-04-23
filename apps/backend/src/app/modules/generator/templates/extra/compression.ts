export function compression(mainType: "fastify" | "express", withConfigModule: boolean) {
	return [
		{
			replacer: `import { NestFactory } from "@nestjs/core";`,
			content: `import { NestFactory } from "@nestjs/core";\nimport compression from ${mainType === "fastify" ? '"@fastify/compress"' : "compression"};`
		},
		{
			replacer: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};`,
			content: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};\n${mainType === "fastify" ? "await app.register(compression)" : "app.use(compression())"}`
		}
	];
}
