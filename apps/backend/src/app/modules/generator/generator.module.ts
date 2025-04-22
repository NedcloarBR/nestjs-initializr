import { Module } from "@nestjs/common";
import { Services } from "../../constants/services";
import { GeneratorController } from "./generator.controller";
import { GeneratorService } from "./generator.service";
import { ExtraService, MainUpdaterService, ModuleService, PackageJsonService, SwaggerService } from "./generators";
import { LinterFormatterService } from "./generators/linter-formater.service";

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
