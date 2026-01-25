import path from "node:path";
import { Global, Module, type Provider } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { Services } from "../../constants/services";
import { ConfigService } from "./config.service";
import { configValidator } from "./config.validator";

const providers: Provider[] = [{ provide: Services.Config, useClass: ConfigService }];

@Global()
@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: false,
			envFilePath: [path.join(process.cwd(), `.env.${process.env.NODE_ENV}`)],
			validate: configValidator
		})
	],
	providers: [...providers],
	exports: [...providers]
})
export class ConfigModule {}
