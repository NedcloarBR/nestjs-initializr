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
		LinterFormatterService
	]
})
export class GeneratorModule {}
