export const ListenersTemplate = {
	name: "lavalink-listerners.service.ts",
	path: "src/modules/necord",
	content: `
    import { Injectable, Logger } from '@nestjs/common';
    import { Context } from 'necord';
    import { OnLavalinkManager, OnNodeManager, LavalinkManagerContextOf,    NodeManagerContextOf } from '@necord/lavalink';

    @Injectable()
    export class AppService {
        private readonly logger = new Logger(AppService.name);

        @OnNodeManager('connect')
        public onConnect(@Context() [node]: NodeManagerContextOf<'connect'>) {
            this.logger.log(\`Node: \${node.options.id} Connected\`);
        }

        @OnLavalinkManager('playerCreate')
        public onPlayerCreate(@Context() [player]:    LavalinkManagerContextOf<'playerCreate'>) {
            this.logger.log(\`Player created at \${player.guildId}\`);
        }
    }
  `
};
