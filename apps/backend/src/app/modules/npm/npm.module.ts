import { Module } from "@nestjs/common";
import { CacheModule } from "../cache/cache.module";
import { HttpModule } from "../http/http.module";
import { NpmController } from "./npm.controller";
import { NpmService } from "./npm.service";

@Module({
	imports: [HttpModule, CacheModule],
	providers: [NpmService],
	controllers: [NpmController]
})
export class NpmModule {}
