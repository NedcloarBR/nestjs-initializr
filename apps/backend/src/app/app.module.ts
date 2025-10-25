import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, GeneratorModule } from "./modules";
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
		GeneratorModule,
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
