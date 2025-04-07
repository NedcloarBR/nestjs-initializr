export const content = `
import { Module, type Provider } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { ConfigService } from "./config.service";
import EnvConfig from "./dtos/env.dto";

const provider: Provider<ConfigService> = {
  provide: Services.Config,
  useClass: ConfigService,
}

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig]
    })
  ],
  providers: [provider],
  exports: [provider],
})
export class ConfigModule {}
`;
