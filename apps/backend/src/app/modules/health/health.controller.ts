import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
// biome-ignore lint/style/useImportType: <>
import {
	DiskHealthIndicator,
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	MemoryHealthIndicator
} from "@nestjs/terminus";
import { ApiHealthCheck, ApiLivenessCheck } from "./health.swagger";

@ApiTags("Health")
@Controller("health")
export class HealthController {
	public constructor(
		private health: HealthCheckService,
		private http: HttpHealthIndicator,
		private memory: MemoryHealthIndicator,
		private disk: DiskHealthIndicator
	) {}

	@Get()
	@HealthCheck()
	@ApiHealthCheck()
	public async check() {
		const result = await this.health.check([
			() => this.http.pingCheck("nestjs-docs", "https://docs.nestjs.com"),
			() => this.http.pingCheck("npm-registry", "https://registry.npmjs.org"),
			() => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024),
			() => this.memory.checkRSS("memory_rss", 500 * 1024 * 1024),
			() => this.disk.checkStorage("storage", { path: "/", thresholdPercent: 0.9 })
		]);

		return {
			...result,
			timestamp: new Date().toISOString()
		};
	}

	@Get("live")
	@ApiLivenessCheck()
	live() {
		return { status: "ok", timestamp: new Date().toISOString() };
	}
}
