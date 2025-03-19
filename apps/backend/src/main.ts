import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app/app.module";
import { Services } from "./app/constants/services";
import type { ConfigService } from "./app/modules/config/config.service";
import { setupSwagger } from "./lib";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	const configService = app.get<ConfigService>(Services.ConfigService);
	const globalPrefix = configService.get("BACKEND_GLOBAL_PREFIX");
	app.setGlobalPrefix(globalPrefix);
	const port = configService.get("BACKEND_PORT");

	setupSwagger(app, globalPrefix, port);

	await app.listen(port, "0.0.0.0");
	Logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`, "Bootstrap");
}

bootstrap();
