export function helmet(mainType: "fastify" | "express", withConfigModule: boolean) {
	const contentImport =
		mainType === "fastify"
			? `import { NestFactory } from "@nestjs/core";\nimport helmet from "@fastify/helmet";`
			: `import { NestFactory } from "@nestjs/core";\nimport helmet from "helmet";`;

	const contentPlugin =
		mainType === "fastify"
			? `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};\nawait app.register(helmet)`
			: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};\napp.use(helmet())`;

	return [
		{
			replacer: 'import { NestFactory } from "@nestjs/core";',
			content: contentImport
		},
		{
			replacer: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};`,
			content: contentPlugin
		}
	];
}
