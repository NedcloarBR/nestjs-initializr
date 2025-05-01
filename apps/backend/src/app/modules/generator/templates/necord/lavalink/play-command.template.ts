export const playTemplate = {
	name: "play.command.ts",
	path: "src/modules/necord/commands/play",
	content: `
    import { Injectable, UseInterceptors } from '@nestjs/common';
    import { NecordLavalinkService, PlayerManager } from 'lavalink-client';
    import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
    import { QueryDto } from './query.dto';
    import { SourceAutocompleteInterceptor } from 'source.autocomplete';

    @Injectable()
    export class AppCommands {
      public constructor(
        private readonly playerManager: PlayerManager,
        private readonly lavalinkService: NecordLavalinkService
      ) {}
      @UseInterceptors(SourceAutocompleteInterceptor)
      @SlashCommand({
        name: 'play',
        description: 'play a track',
      })
      public async onPlay(
        @Context() [interaction]: SlashCommandContext,
        @Options() { query, source }: QueryDto,
      ) {
        const player = this.playerManager.get(interaction.guild.id) ??
          this.playerManager.create({
            ..this.lavalinkService.extractInfoForPlayer(interaction),
            selfDeaf: true,
            selfMute: false,
            volume: 100,
          });
        await player.connect();
        const res = await player.search(
          {
            query,
            source: source ?? 'soundcloud'
          },
          interaction.user.id,
        );
        await player.queue.add(res.tracks[0]);
        if (!player.playing) await player.play();
        return interaction.reply({
          content: \`Now playing \${res.tracks[0].info.title}\`,
        });
      }
    }
  `
};
