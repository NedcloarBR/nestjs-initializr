import { Module } from "@nestjs/common";
import { Services } from "../../constants/services";
import { GeneratorController } from "./generator.controller";
import { GeneratorService } from "./generator.service";
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
		ModuleService
	]
})
export class GeneratorModule {}
