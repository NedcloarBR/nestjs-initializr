import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, GeneratorModule } from "./modules";
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
		GeneratorModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
