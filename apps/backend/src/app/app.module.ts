import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, HealthModule, NpmModule, PluginGeneratorModule } from "./modules";

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
		// DebugModule, //! Disabled due problems to debug ConfigModule Plugin
		PluginGeneratorModule,
		NpmModule,
		HealthModule
		// StaticModule, //! Disabled due problems to debug ConfigModule Plugin in DebugModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
