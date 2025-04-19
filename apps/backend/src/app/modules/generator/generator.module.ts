import { Module } from "@nestjs/common";
import { Services } from "../../constants/services";
import { GeneratorController } from "./generator.controller";
import { GeneratorService } from "./generator.service";
import { MainUpdaterService } from "./generators/main-updater.service";
import { ModuleService } from "./generators/module.service";
import { PackageJsonService } from "./generators/package-json.service";

@Module({
	controllers: [GeneratorController],
	providers: [
		{
			provide: Services.Generator,
			useClass: GeneratorService
		},
		PackageJsonService,
		ModuleService,
		MainUpdaterService
	]
})
export class GeneratorModule {}
