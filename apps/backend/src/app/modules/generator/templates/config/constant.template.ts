export const configConstants = {
	token: 'Config = "CONFIG_SERVICE"',
	import: "ConfigModule",
	export: 'export { ConfigModule } from "./config/config.module"',
	importArray: "ConfigModule",
	inject: "@Inject(Services.Config) private readonly configService: ConfigService,",
	importIn: "src/app.module.ts"
};
