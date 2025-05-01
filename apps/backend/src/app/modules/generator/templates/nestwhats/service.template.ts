export const NestWhatsServiceTemplate = {
	path: "src/modules/nestwhats",
	name: "nestwhats.service.ts",
	content: `
    import { Injectable, Logger } from '@nestjs/common';
    import { Context, On, Once, ContextOf } from 'nestwhats';
    import { Client, Events } from 'whatsapp-web.js';

    @Injectable()
    export class AppUpdate {
      private readonly logger = new Logger(AppUpdate.name);
      public constructor(private readonly client: Client) {}

      @Once("ready")
      public onReady() {
        this.logger.log(\`Bot logged in as \${this.client.info.pushname}\`);
      }

      @On("message_create")
      public onMessageCreate(@Context() [message]: ContextOf<'message_create'>) {
        this.logger.log(message);
      }
    }
  `
};
