export const mainBasicTemplate = `
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = 3000;
  const globalPrefix = "api"
	app.setGlobalPrefix(globalPrefix);
	await app.listen(port);
	Logger.log(\`Application is running on: http://localhost:\${port}/\${globalPrefix}\`, "Bootstrap");
}

bootstrap();
`;

export const mainFastifyTemplate = `
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const globalPrefix = "api"
  app.setGlobalPrefix(globalPrefix);
  const port = 3000

  await app.listen(port, "0.0.0.0");
  Logger.log(\`Application is running on: http://localhost:\${port}/\${globalPrefix}\`, "Bootstrap");
}

bootstrap();
`;
