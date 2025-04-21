const serviceConstant = `Config = "CONFIG_SERVICE"`;

const name = "ConfigModule";

const exporter = `export { ConfigModule } from "./config/config.module"`;

const inject = "@Inject(Services.Config) private readonly configService: ConfigService,";

export const configConstants = {
	serviceConstant,
	name,
	exporter,
	inject
};
