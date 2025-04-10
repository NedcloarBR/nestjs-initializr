import { Module } from "@nestjs/common";
import { Services } from "../../constants/services";
import { GeneratorController } from "./generator.controller";
import { GeneratorService } from "./generator.service";
import { PackageJsonService } from "./generators/package-json.service";

@Module({
	controllers: [GeneratorController],
	providers: [
		{
			provide: Services.Generator,
			useClass: GeneratorService
		},
		PackageJsonService
	]
})
export class GeneratorModule {}
