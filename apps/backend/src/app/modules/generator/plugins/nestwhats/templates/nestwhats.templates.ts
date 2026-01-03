/**
 * NestWhats templates - WhatsApp bot framework for NestJS
 */

export const nestwhatsModuleTemplate = {
	name: "nestwhats.module.ts",
	path: "src/modules/nestwhats",
	content: `
import { Module } from "@nestjs/common";
import { NestWhatsModule as NestWhatsModuleCore } from "nestwhats";
import { NestWhatsService } from "./nestwhats.service";

@Module({
  imports: [
    NestWhatsModuleCore.forRoot({
      prefix: "!"
    })
  ],
  providers: [NestWhatsService]
})
export class NestWhatsWrapperModule {}
`.trim()
};

export const nestwhatsServiceTemplate = {
	name: "nestwhats.service.ts",
	path: "src/modules/nestwhats",
	content: `
import { Injectable, Logger } from "@nestjs/common";
import { Context, On, Once, ContextOf } from "nestwhats";
import { Client } from "whatsapp-web.js";

@Injectable()
export class NestWhatsService {
  private readonly logger = new Logger(NestWhatsService.name);

  public constructor(private readonly client: Client) {}

  @Once("ready")
  public onReady() {
    this.logger.log(\`Bot logged in as \${this.client.info.pushname}\`);
  }

  @On("message_create")
  public onMessageCreate(@Context() [message]: ContextOf<"message_create">) {
    this.logger.log(message);
  }
}
`.trim()
};
