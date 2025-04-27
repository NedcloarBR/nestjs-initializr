import { Module } from "@nestjs/common";
import { Services } from "../../constants/services";
import { GeneratorController } from "./generator.controller";
import { GeneratorService } from "./generator.service";
import {
	ExtraService,
	LinterFormatterService,
	MainUpdaterService,
	ModuleService,
	PackageJsonService,
	SwaggerService
} from "./generators";
import { DockerService } from "./generators/docker.service";

@Module({
	controllers: [GeneratorController],
	providers: [
		{
			provide: Services.Generator,
			useClass: GeneratorService
		},
		PackageJsonService,
		ModuleService,
		MainUpdaterService,
		SwaggerService,
		ExtraService,
		LinterFormatterService,
		DockerService
	]
})
export class GeneratorModule {}
