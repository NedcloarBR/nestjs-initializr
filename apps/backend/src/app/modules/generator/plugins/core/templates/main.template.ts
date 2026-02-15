import type { DynamicTemplate, StaticTemplate } from "@/types";

export const mainTemplate: DynamicTemplate = (mainType): StaticTemplate => {
	const MainPlatformImport =
		mainType === "fastify"
			? "FastifyAdapter, type NestFastifyApplication"
			: "ExpressAdapter, type NestExpressApplication";

	const MainPlatform = mainType === "fastify" ? "NestFastifyApplication" : "NestExpressApplication";

	const adapterArg = mainType === "fastify" ? ", new FastifyAdapter()" : ", new ExpressAdapter()";

	return {
		name: "main.ts",
		path: "src",
		content: `
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ${MainPlatformImport} } from "@nestjs/platform-${mainType}";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<${MainPlatform}>(AppModule${adapterArg});
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = 4404;

  await app.listen(port, "0.0.0.0");
  Logger.log(\`Application is running on: http://localhost:\${port}/\${globalPrefix}\`, "Bootstrap");
}

void bootstrap();
`.trim()
	};
};
