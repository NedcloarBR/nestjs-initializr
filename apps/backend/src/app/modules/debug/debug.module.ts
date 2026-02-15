import { Module } from "@nestjs/common";
import { PluginGeneratorModule } from "../generator/generator.module";
import { DebugController } from "./debug.controller";
import { DebugGateway } from "./debug.gateway";
import { DebugService } from "./debug.service";

@Module({
	imports: [PluginGeneratorModule],
	controllers: [DebugController],
	providers: [DebugGateway, DebugService],
	exports: [DebugGateway, DebugService]
})
export class DebugModule {}
