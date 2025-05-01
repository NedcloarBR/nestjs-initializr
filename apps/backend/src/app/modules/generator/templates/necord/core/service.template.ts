export const NecordServiceTemplate = {
	name: "necord.service.ts",
	path: "src/modules/necord",
	content: `
    import { Injectable, Logger } from "@nestjs/common";
    import { Once, On, Context, ContextOf } from "necord";

    @Injectable()
    export class NecordService {
      private readonly logger = new Logger(NecordService.name);

      @Once("ready")
      public onReady(@Context() [client]: ContextOf<"ready">) {
        this.logger.log(\`Bot logged in as \${client.user.username}\`);
      }

      @On("warn")
      public onWarn(@Context() [message]: ContextOf<"warn">) {
        this.logger.warn(message);
      }
    }
  `
};
