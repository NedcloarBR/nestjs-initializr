export const configServiceTemplate = {
	name: "config.service.ts",
	path: "src/modules/config",
	content: `
    import { Injectable } from "@nestjs/common";
    import { ConfigService as NestConfigService } from "@nestjs/config";
    import { EnvDTO } from "./dtos/env.dto";

    export type ConfigSchema = InstanceType<typeof EnvDTO>;

    @Injectable()
    export class ConfigService {
    	public constructor(
    		private readonly nestConfigService: NestConfigService<ConfigSchema>
    	) {}

    	public get<K extends keyof ConfigSchema>(value: K): ConfigSchema[K] {
    		return this.nestConfigService.get<ConfigSchema[K]>(value);
    	}
    }
  `
};
