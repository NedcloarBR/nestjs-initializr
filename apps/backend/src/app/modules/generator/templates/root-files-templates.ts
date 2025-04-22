import { ReadmeContent } from "./readme.content";

export function RootFilesTemplates(mainType: "fastify" | "express") {
	const MainPlatformImport =
		mainType === "fastify"
			? "FastifyAdapter, type NestFastifyApplication"
			: "ExpressAdapter, type NestExpressApplication";

	const MainPlatform = mainType === "fastify" ? "NestFastifyApplication" : "NestExpressApplication";

	return [
		{
			name: "main.ts",
			path: "src",
			content: `
        import { Logger } from "@nestjs/common";
        import { NestFactory } from "@nestjs/core";
        import { ${MainPlatformImport} } from "@nestjs/platform-${mainType}";
        import { AppModule } from "./app.module";

        async function bootstrap() {
          const app = await NestFactory.create<${MainPlatform}>(AppModule${mainType === "fastify" ? ", new FastifyAdapter()" : ", new ExpressAdapter()  "});
          const globalPrefix = "api";
          app.setGlobalPrefix(globalPrefix);
          const port = 3000;

          await app.listen(port, "0.0.0.0");
          Logger.log(\`Application is running on: http://localhost:\${port}/\$        {globalPrefix}\`, "Bootstrap");
        }

        bootstrap();
      `
		},
		{
			name: "nest-cli.json",
			path: "",
			content: `
        {
          "$schema": "https://json.schemastore.org/nest-cli",
          "collection": "@nestjs/schematics",
          "sourceRoot": "src",
          "compilerOptions": {
            "deleteOutDir": true
          }
        }
      `
		},
		{
			name: "README.md",
			path: "",
			content: ReadmeContent
		},
		{
			name: "tsconfig.json",
			path: "",
			content: `
        {
          "compilerOptions": {
            "module": "commonjs",
            "declaration": true,
            "removeComments": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "allowSyntheticDefaultImports": true,
            "target": "ES2023",
            "sourceMap": true,
            "outDir": "./dist",
            "typeRoots": ["./node_modules/@types", "./src/types"],
            "incremental": true,
            "forceConsistentCasingInFileNames": true,
            "skipLibCheck": true,
            "baseUrl": "./src",
	        	"paths": {
	        		"@/*": ["./*"]
	        	}
          }
        }
      `
		},
		{
			name: "tsconfig.build.json",
			path: "",
			content: `
        {
          "extends": "./tsconfig.json",
          "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
        }
      `
		}
	];
}
