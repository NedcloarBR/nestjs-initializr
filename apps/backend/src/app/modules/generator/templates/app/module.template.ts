export const content = `
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
`;

export const appModuleTemplate = {
	name: "app.module.ts",
	path: "src",
	content
};
