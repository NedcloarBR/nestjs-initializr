export function helmet(mainType: "fastify" | "express", withConfigModule: boolean) {
	const contentImport =
		mainType === "fastify" ? `import helmet from "@fastify/helmet";` : `import helmet from "helmet";`;

	const contentPlugin =
		mainType === "fastify"
			? `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};\napp.register(helmet)`
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
