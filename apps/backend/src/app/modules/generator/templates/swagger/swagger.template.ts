export function swaggerLibTemplate(mainType: "fastify" | "express") {
	const content = `
import { Logger } from "@nestjs/common";
import type { ${mainType === "fastify" ? "NestFastifyApplication" : "NestExpressApplication"} } from "@nestjs/platform-${mainType}";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: ${mainType === "fastify" ? "NestFastifyApplication" : "NestExpressApplication"}, globalPrefix: string, port: number): void {
  const logger = new Logger("Documentation");
  const documentConfig = new DocumentBuilder()
    .setTitle("{{PROJECT_NAME}}")
    .setDescription("API Documentation for the {{PROJECT_NAME}}")
    .setVersion("v1.0.0")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup(\`\${globalPrefix}/docs\`, app, documentFactory, {
    jsonDocumentUrl: \`\${globalPrefix}/docs/json\`,
    yamlDocumentUrl: \`\${globalPrefix}/docs/yaml\`
  });

  logger.verbose(\`Swagger is available at: http://localhost:\${port}/\${globalPrefix}/docs\`);
  logger.verbose(\`JSON is available at: http://localhost:\${port}/\${globalPrefix}/docs/json\`);
  logger.verbose(\`YAML is available at: http://localhost:\${port}/\${globalPrefix}/docs/yaml\`);
}

`;
	return {
		name: "swagger.ts",
		path: "src/lib",
		content
	};
}

export enum swaggerTemplateReplaceKeys {
	PROJECT_NAME = "{{PROJECT_NAME}}"
}
