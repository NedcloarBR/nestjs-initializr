export function SwaggerTemplates(
	mainType: "fastify" | "express",
	withConfigModule: boolean,
	withI18nModule: boolean,
	withScalarApiReference: boolean
) {
	return {
		templates: [
			{
				name: "swagger.ts",
				path: "src/lib",
				content: `
          import { Logger } from "@nestjs/common";
          import type { ${mainType === "fastify" ? "NestFastifyApplication" : "NestExpressApplication"} } from "@nestjs/platform-${mainType}";
          import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
          ${withScalarApiReference ? 'import { apiReference } from "@scalar/nestjs-api-reference";' : ""}

          export function setupSwagger(app: ${mainType === "fastify" ? "NestFastifyApplication" : "NestExpressApplication"}, globalPrefix: string, port: number): void {
            const logger = new Logger("Documentation");
            const documentConfig = new DocumentBuilder()
              .setTitle("${SwaggerTemplateReplaceKeys.PROJECT_NAME}")
              .setDescription("API Documentation for the ${SwaggerTemplateReplaceKeys.PROJECT_NAME}")
              .setVersion("v1.0.0")
              ${
								withI18nModule
									? `
                 .addGlobalParameters({
                    in: 'header',
                    required: false,
                    name: 'x-lang',
                    schema: {
                      example: 'en-US',
                    },
                  })
                `
									: ""
							}
              .build();

            const documentFactory = () => SwaggerModule.createDocument(app, documentConfig);

            SwaggerModule.setup(\`\${globalPrefix}/docs\`, app, documentFactory, {
              jsonDocumentUrl: \`\${globalPrefix}/docs/json\`,
              yamlDocumentUrl: \`\${globalPrefix}/docs/yaml\`,
              swaggerOptions: {
                operationsSorter: (a, b) => {
                  const methodOrder = ['get', 'post', 'patch', 'put', 'delete'];
                  const methodA = methodOrder.indexOf(a.get('method').toLowerCase());
                  const methodB = methodOrder.indexOf(b.get('method').toLowerCase());
                  return methodA - methodB;
                },
              },
            });

            ${
							withScalarApiReference
								? `
              app.use(
                \`/\${globalPrefix}/docs/reference\`,
                apiReference({
                  content: documentFactory,
                  ${mainType === "fastify" ? "withFastify: true" : ""}
                }),
              );
            `
								: ""
						}
            ${withScalarApiReference ? "logger.verbose(`API Reference is available at: http://localhost:${port}/${globalPrefix}/docs/reference`);" : ""}
            logger.verbose(\`Swagger is available at: http://localhost:\${port}/\${globalPrefix}/docs\`);
            logger.verbose(\`JSON is available at: http://localhost:\${port}/\${globalPrefix}/docs/json\`);
            logger.verbose(\`YAML is available at: http://localhost:\${port}/\${globalPrefix}/docs/yaml\`);
          }
        `
			}
		],
		lib: {
			name: "index.ts",
			path: "src/lib",
			content: `export * from "./swagger";`
		},
		main: [
			{
				replacer: 'import { AppModule } from "./app.module";',
				content: 'import { AppModule } from "./app.module";\nimport { setupSwagger } from "./lib";'
			},
			{
				replacer: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};`,
				content: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};\nsetupSwagger(app, globalPrefix, port);`
			}
		]
	};
}

export enum SwaggerTemplateReplaceKeys {
	PROJECT_NAME = "{{PROJECT_NAME}}"
}
