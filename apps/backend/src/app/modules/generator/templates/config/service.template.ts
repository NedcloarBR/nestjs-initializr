export const content = `
import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { EnvDTO } from "./dtos/env.dto";

export type ConfigSchema = EnvDTO

@Injectable()
export class ConfigService {
	public constructor(
		private readonly nestConfigService: NestConfigService
	) {}

	public get<K extends keyof ConfigSchema>(value: K): ConfigSchema[K] {
		return this.nestConfigService.get<ConfigSchema[K]>(value);
	}
}
`;
