import { Module } from "@nestjs/common";
import { ConfigModule } from "./modules";

@Module({
	imports: [ConfigModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
