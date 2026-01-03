import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, PluginGeneratorModule } from "./modules";
import { HealthModule } from "./modules/health/health.module";
import { NpmModule } from "./modules/npm/npm.module";

@Module({
	imports: [
		ConfigModule,
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 60_000,
					limit: 10
				}
			]
		}),
		PluginGeneratorModule,
		NpmModule,
		HealthModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
