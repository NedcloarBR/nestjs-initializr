export const configModuleTemplate = {
	name: "config.module.ts",
	path: "src/modules/config",
	content: `
    import { Global, Module } from "@nestjs/common";
    import { ConfigModule as NestConfigModule } from "@nestjs/config";
    import { ConfigService } from "./config.service";
    import EnvConfig from "./dtos/env.dto";
    import { Services } from "../../constants/services";

    @Global()
    @Module({
      imports: [
        NestConfigModule.forRoot({
          load: [EnvConfig]
        })
      ],
      providers: [
        {
          provide: Services.Config,
          useClass: ConfigService,
        }
      ],
      exports: [Services.Config],
    })
    export class ConfigModule {}
  `
};
