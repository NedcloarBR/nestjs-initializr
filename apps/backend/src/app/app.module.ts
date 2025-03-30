import { Module } from "@nestjs/common";
import { ConfigModule, GeneratorModule } from "./modules";
@Module({
	imports: [ConfigModule, GeneratorModule],
	controllers: [],
	providers: []
})
export class AppModule {}
