import { Module } from "@nestjs/common";
import { Services } from "../../constants/services";
import { GeneratorController } from "./generator.controller";
import { GeneratorService } from "./generator.service";
import {
	ExtraService,
	FileUpdaterService,
	LinterFormatterService,
	ModuleService,
	PackageJsonService,
	SwaggerService,
	TestRunnerService
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
		FileUpdaterService,
		SwaggerService,
		ExtraService,
		LinterFormatterService,
		DockerService,
		TestRunnerService
	]
})
export class GeneratorModule {}
