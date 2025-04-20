export function mainTemplate(mainType: "fastify" | "express") {
	const platformImport =
		mainType === "fastify"
			? "FastifyAdapter, type NestFastifyApplication"
			: "ExpressAdapter, type NestExpressApplication";

	const appPlatform = mainType === "fastify" ? "NestFastifyApplication" : "NestExpressApplication";

	const content = `
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ${platformImport} } from "@nestjs/platform-${mainType}";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<${appPlatform}>(AppModule${mainType === "fastify" ? ", new FastifyAdapter()" : ", new ExpressAdapter()"});
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = 3000;

  await app.listen(port, "0.0.0.0");
  Logger.log(\`Application is running on: http://localhost:\${port}/\${globalPrefix}\`, "Bootstrap");
}

bootstrap();
`;

	return {
		name: "main.ts",
		path: "src",
		content
	};
}
