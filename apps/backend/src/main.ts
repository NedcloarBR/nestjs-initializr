import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app/app.module";
import { Services } from "./app/constants/services";
import type { ConfigService } from "./app/modules/config";
import { setupSwagger } from "./lib";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	const configService = app.get<ConfigService>(Services.Config);
	const globalPrefix = configService.get("BACKEND_GLOBAL_PREFIX");
	app.setGlobalPrefix(globalPrefix);
	const port = configService.get("BACKEND_PORT");

	app.useGlobalPipes(
		new ValidationPipe({
			always: true,
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	);

	app.enableCors({
		origin: configService.get("BACKEND_CORS_ORIGIN")
	});

	setupSwagger(app, globalPrefix, port);

	await app.listen(port, "0.0.0.0");
	Logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`, "Bootstrap");
}

bootstrap();
