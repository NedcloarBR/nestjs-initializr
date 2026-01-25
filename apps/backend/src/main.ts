import helmet from "@fastify/helmet";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app/app.module";
import { HttpExceptionFilter } from "./app/common/filters";
import { AxiosInterceptor, RequestIdInterceptor } from "./app/common/interceptors";
import { Services } from "./app/constants/services";
import type { ConfigService } from "./app/modules/config";
import { setupSwagger } from "./lib";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	const configService = app.get<ConfigService>(Services.Config);
	const globalPrefix = configService.get("GLOBAL_PREFIX");
	app.setGlobalPrefix(globalPrefix);
	const port = configService.get("PORT");

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
		origin: configService.get("CORS_ORIGIN"),
		credentials: true,
		methods: ["GET", "POST"],
		allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
		exposedHeaders: ["X-Request-Id"],
		maxAge: 3600
	});

	await app.register(helmet, {
		contentSecurityPolicy: {
			directives: {
				defaultSrc: [`'self'`],
				styleSrc: [`'self'`, `'unsafe-inline'`],
				imgSrc: [`'self'`, "data:", "validator.swagger.io"],
				scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
			}
		}
	});

	app.enableShutdownHooks();

	await setupSwagger(app, globalPrefix, port);

	await app.listen(port, "0.0.0.0");
	Logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`, "Bootstrap");
}

void bootstrap();
