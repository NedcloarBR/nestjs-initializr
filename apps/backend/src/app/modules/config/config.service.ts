import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: Cannot use import type in classes used in dependency injection
import { ConfigService as NestConfigService } from "@nestjs/config";
import type { ConfigDTO } from "./config.dto";

type ConfigSchema = {
	[K in keyof InstanceType<typeof ConfigDTO>]: InstanceType<typeof ConfigDTO>[K];
};

@Injectable()
export class ConfigService {
	public constructor(private readonly nestConfigService: NestConfigService<ConfigSchema>) {}

	public get<K extends keyof ConfigSchema>(value: K): ConfigSchema[K] {
		return this.nestConfigService.get<ConfigSchema[K]>(value);
	}
}
