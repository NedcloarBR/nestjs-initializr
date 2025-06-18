export const AppTemplates = [
	{
		name: "app.module.ts",
		path: "src",
		content: `
      import { Module } from "@nestjs/common";
      import { AppController } from "./app.controller";
      import { AppService } from "./app.service";

      @Module({
        imports: [],
        controllers: [AppController],
        providers: [AppService],
      })
      export class AppModule {}
    `
	},
	{
		name: "app.controller.ts",
		path: "src",
		content: `
      import { Controller, Get } from "@nestjs/common";
      import { AppService } from "./app.service";

      @Controller()
      export class AppController {
        public constructor(private readonly appService: AppService) {}

        @Get()
        public getHello(): string {
          return this.appService.getHello();
        }
      }
    `
	},
	{
		name: "app.service.ts",
		path: "src",
		content: `
      import { Injectable } from "@nestjs/common";

      @Injectable()
      export class AppService {
        public getHello(): string {
          return "Hello World!";
        }
      }
    `
	}
];
