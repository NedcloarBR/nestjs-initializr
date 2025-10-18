import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";

@Module({
	imports: [
		NestCacheModule.register({
			ttl: 300000,
			max: 100
		})
	],
	exports: [NestCacheModule]
})
export class CacheModule {}
