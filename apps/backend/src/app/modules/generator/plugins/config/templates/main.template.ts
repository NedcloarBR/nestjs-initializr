import type { DynamicTemplate, StaticTemplate } from "@/types";

/**
 * Template for updating main.ts to use ConfigService
 */
export const configMainTemplate: DynamicTemplate = (mainType): StaticTemplate => {
	const platformType = mainType === "fastify" ? "NestFastifyApplication" : "NestExpressApplication";
	const adapter = mainType === "fastify" ? "FastifyAdapter" : "ExpressAdapter";

	return {
		name: "main.ts",
		path: "src",
		content: `
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ${adapter}, type ${platformType} } from "@nestjs/platform-${mainType}";
import { AppModule } from "./app.module";
import { Services } from "./constants/services";
import { ConfigService } from "./modules/config/config.service";

async function bootstrap() {
  const app = await NestFactory.create<${platformType}>(AppModule, new ${adapter}());
  const configService = app.get<ConfigService>(Services.Config);
  const globalPrefix = configService.get("GLOBAL_PREFIX");
  app.setGlobalPrefix(globalPrefix);
  const port = configService.get("PORT");

  await app.listen(port, "0.0.0.0");
  Logger.log(\`Application is running on: http://localhost:\${port}/\${globalPrefix}\`, "Bootstrap");
}

void bootstrap();
`.trim()
	};
};
