import { HttpModule as NestHttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
	imports: [
		NestHttpModule.register({
			timeout: 5000,
			maxRedirects: 5
		})
	],
	exports: [NestHttpModule]
})
export class HttpModule {}
