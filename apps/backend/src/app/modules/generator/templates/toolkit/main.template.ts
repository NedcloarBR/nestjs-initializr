export function NestjsToolkitMainTemplate(withConfigModule: boolean) {
	return [
		{
			replacer: 'import { AppModule } from "./app.module";',
			content:
				'import { AppModule } from "./app.module";\nimport { registerHelpers } from "@nedcloarbr/nestjs-toolkit";'
		},
		{
			replacer: withConfigModule
				? 'const globalPrefix = configService.get("GLOBAL_PREFIX");'
				: 'const globalPrefix = "api";',
			content: withConfigModule
				? 'await registerHelpers({ verbose: true });\nconst globalPrefix = configService.get("GLOBAL_PREFIX");'
				: 'await registerHelpers({ verbose: true });\nconst globalPrefix = "api";'
		}
	];
}
