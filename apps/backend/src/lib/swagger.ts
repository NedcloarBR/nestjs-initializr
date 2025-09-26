import { Logger } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

export async function setupSwagger(app: NestFastifyApplication, globalPrefix: string, port: number): Promise<void> {
	const logger = new Logger("Documentation");
	const documentConfig = new DocumentBuilder()
		.setTitle("NestJS Initializr")
		.setDescription("API Documentation for the NestJS Initializr")
		.setVersion("v1.0.0")
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, documentConfig);

	SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory, {
		jsonDocumentUrl: `${globalPrefix}/docs/json`,
		yamlDocumentUrl: `${globalPrefix}/docs/yaml`,
		swaggerOptions: {
			operationsSorter: (a, b) => {
				const methodOrder = ["get", "post", "patch", "put", "delete"];
				const methodA = methodOrder.indexOf(a.get("method").toLowerCase());
				const methodB = methodOrder.indexOf(b.get("method").toLowerCase());
				return methodA - methodB;
			}
		}
	});

	app.use(`/${globalPrefix}/docs/reference`, apiReference({ content: documentFactory, withFastify: true }));

	logger.verbose(`API Reference is available at: http://localhost:${port}/${globalPrefix}/docs/reference`);
	logger.verbose(`Swagger is available at: http://localhost:${port}/${globalPrefix}/docs`);
	logger.verbose(`JSON is available at: http://localhost:${port}/${globalPrefix}/docs/json`);
	logger.verbose(`YAML is available at: http://localhost:${port}/${globalPrefix}/docs/yaml`);
}
