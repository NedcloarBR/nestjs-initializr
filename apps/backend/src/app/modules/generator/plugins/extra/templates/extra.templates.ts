/**
 * Extra templates - Generates configuration snippets for extras (cors, helmet, compression, validation)
 *
 * These are updates to main.ts based on the selected extras
 */

// ============================================
// CORS Templates
// ============================================

export function corsTemplates(withConfigModule: boolean) {
	return {
		// CORS doesn't need imports, just app.enableCors()
		mainUpdate: {
			replacer: withConfigModule ? 'configService.get("PORT")' : "3000",
			content: withConfigModule
				? `configService.get("PORT");
  app.enableCors({
    origin: "*"
  })`
				: `3000;
  app.enableCors({
    origin: "*"
  })`
		}
	};
}

// ============================================
// Helmet Templates
// ============================================

export function helmetTemplates(mainType: "fastify" | "express", withConfigModule: boolean) {
	const importStatement =
		mainType === "fastify" ? 'import helmet from "@fastify/helmet";' : 'import helmet from "helmet";';

	const useStatement = mainType === "fastify" ? "await app.register(helmet);" : "app.use(helmet());";

	return {
		import: {
			replacer: 'import { NestFactory } from "@nestjs/core";',
			content: `import { NestFactory } from "@nestjs/core";
${importStatement}`
		},
		mainUpdate: {
			replacer: withConfigModule ? 'configService.get("PORT")' : "3000",
			content: withConfigModule
				? `configService.get("PORT");
  ${useStatement}`
				: `3000;
  ${useStatement}`
		}
	};
}

// ============================================
// Compression Templates
// ============================================

export function compressionTemplates(mainType: "fastify" | "express", withConfigModule: boolean) {
	const importStatement =
		mainType === "fastify" ? 'import compression from "@fastify/compress";' : 'import compression from "compression";';

	const useStatement = mainType === "fastify" ? "await app.register(compression);" : "app.use(compression());";

	return {
		import: {
			replacer: 'import { NestFactory } from "@nestjs/core";',
			content: `import { NestFactory } from "@nestjs/core";
${importStatement}`
		},
		mainUpdate: {
			replacer: withConfigModule ? 'configService.get("PORT")' : "3000",
			content: withConfigModule
				? `configService.get("PORT");
  ${useStatement}`
				: `3000;
  ${useStatement}`
		}
	};
}

// ============================================
// Validation Templates
// ============================================

export function validationTemplates(withConfigModule: boolean) {
	return {
		import: {
			replacer: "import { Logger ",
			content: "import { Logger, ValidationPipe "
		},
		mainUpdate: {
			replacer: withConfigModule ? 'configService.get("PORT")' : "3000",
			content: withConfigModule
				? `configService.get("PORT");
  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )`
				: `3000;
  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )`
		}
	};
}
