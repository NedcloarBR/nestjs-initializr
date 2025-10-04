import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { NpmController } from "./npm.controller";
import { NpmService } from "./npm.service";

@Module({
	imports: [HttpModule],
	providers: [NpmService],
	controllers: [NpmController]
})
export class NpmModule {}
