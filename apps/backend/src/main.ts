import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app/app.module";
import { AxiosInterceptor } from "./app/common/interceptors/axios.interceptor";
import { RequestIdInterceptor } from "./app/common/interceptors/request-id.interceptor";
import { Services } from "./app/constants/services";
import { HttpExceptionFilter } from "./app/filters/http-exception.filter";
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

	app.useGlobalFilters(new HttpExceptionFilter(configService));

	app.useGlobalInterceptors(new RequestIdInterceptor(), new AxiosInterceptor());

	app.enableCors({
		origin: configService.get("BACKEND_CORS_ORIGIN")
	});

	await setupSwagger(app, globalPrefix, port);

	await app.listen(port, "0.0.0.0");
	Logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`, "Bootstrap");
}

void bootstrap();
