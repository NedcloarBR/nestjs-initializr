/**
 * Necord Lavalink templates - Music player integration for Discord bots
 */

// ============================================
// Listeners Template
// ============================================

export const lavalinkListenersTemplate = {
	name: "lavalink-listeners.service.ts",
	path: "src/modules/necord",
	content: `
import { Injectable, Logger } from "@nestjs/common";
import { Context } from "necord";
import { OnLavalinkManager, OnNodeManager, LavalinkManagerContextOf, NodeManagerContextOf } from "@necord/lavalink";

@Injectable()
export class LavalinkListenersService {
  private readonly logger = new Logger(LavalinkListenersService.name);

  @OnNodeManager("connect")
  public onConnect(@Context() [node]: NodeManagerContextOf<"connect">) {
    this.logger.log(\`Node: \${node.options.id} Connected\`);
  }

  @OnLavalinkManager("playerCreate")
  public onPlayerCreate(@Context() [player]: LavalinkManagerContextOf<"playerCreate">) {
    this.logger.log(\`Player created at \${player.guildId}\`);
  }
}
`.trim()
};

// ============================================
// Play Command Template
// ============================================

export const playCommandTemplate = {
	name: "play.command.ts",
	path: "src/modules/necord/commands/play",
	content: `
import { Injectable, UseInterceptors } from "@nestjs/common";
import { NecordLavalinkService, PlayerManager } from "@necord/lavalink";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { QueryDto } from "./query.dto";
import { SourceAutocompleteInterceptor } from "./source.autocomplete";

@Injectable()
export class PlayCommand {
  public constructor(
    private readonly playerManager: PlayerManager,
    private readonly lavalinkService: NecordLavalinkService
  ) {}

  @UseInterceptors(SourceAutocompleteInterceptor)
  @SlashCommand({
    name: "play",
    description: "Play a track"
  })
  public async onPlay(
    @Context() [interaction]: SlashCommandContext,
    @Options() { query, source }: QueryDto
  ) {
    const player = this.playerManager.get(interaction.guild.id) ??
      this.playerManager.create({
        ...this.lavalinkService.extractInfoForPlayer(interaction),
        selfDeaf: true,
        selfMute: false,
        volume: 100
      });

    await player.connect();
    const res = await player.search(
      {
        query,
        source: source ?? "soundcloud"
      },
      interaction.user.id
    );

    await player.queue.add(res.tracks[0]);
    if (!player.playing) await player.play();

    return interaction.reply({
      content: \`Now playing \${res.tracks[0].info.title}\`
    });
  }
}
`.trim()
};

// ============================================
// Query DTO Template
// ============================================

export const queryDtoTemplate = {
	name: "query.dto.ts",
	path: "src/modules/necord/commands/play",
	content: `
import { SearchPlatform } from "lavalink-client";
import { StringOption } from "necord";

export class QueryDto {
  @StringOption({
    name: "query",
    description: "<name | url> of the requested track",
    required: true
  })
  public readonly query!: string;

  @StringOption({
    name: "source",
    description: "Source of the track",
    autocomplete: true,
    required: false
  })
  public readonly source?: SearchPlatform;
}
`.trim()
};

// ============================================
// Source Autocomplete Template
// ============================================

export const sourceAutocompleteTemplate = {
	name: "source.autocomplete.ts",
	path: "src/modules/necord/commands/play",
	content: `
import { Injectable } from "@nestjs/common";
import { AutocompleteInteraction } from "discord.js";
import { DefaultSources } from "lavalink-client";
import { AutocompleteInterceptor } from "necord";

@Injectable()
export class SourceAutocompleteInterceptor extends AutocompleteInterceptor {
  public transformOptions(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);
    let choices: string[] = [];

    if (focused.name === "source") {
      choices = [DefaultSources.soundcloud];
    }

    return interaction.respond(
      choices
        .filter((choice) => choice.startsWith(focused.value.toString()))
        .map((choice) => ({ name: choice, value: choice }))
    );
  }
}
`.trim()
};

// ============================================
// Docker Files
// ============================================

export const lavalinkDockerfileTemplate = {
	name: "Dockerfile",
	path: "lavalink",
	content: `
FROM ghcr.io/lavalink-devs/lavalink:4.0.8-alpine

COPY application.yml /opt/Lavalink/application.yml
COPY plugins/ /opt/Lavalink/plugins/

USER lavalink
`.trim()
};

export const lavalinkDockerComposeTemplate = {
	name: "docker-compose.yml",
	path: "lavalink",
	content: `
services:
  lavalink:
    build: .
    container_name: lavalink
    restart: unless-stopped
    environment:
      - _JAVA_OPTIONS=-Xmx6G
      - SERVER_PORT=2333
      - LAVALINK_SERVER_PASSWORD=youshallnotpass
    expose:
      - 2333
    ports:
      - "2333:2333"
    networks:
      - network

networks:
  network:
    driver: bridge
`.trim()
};

export const lavalinkApplicationYmlTemplate = {
	name: "application.yml",
	path: "lavalink",
	content: `
server:
  port: 2333
  address: 0.0.0.0
  http2:
    enabled: false

lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: false
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      nico: true
      http: true
      local: false
    filters:
      volume: true
      equalizer: true
      karaoke: true
      timescale: true
      tremolo: true
      vibrato: true
      distortion: true
      rotation: true
      channelMix: true
      lowPass: true
    bufferDurationMs: 400
    frameBufferDurationMs: 5000
    opusEncodingQuality: 10
    resamplingQuality: LOW
    trackStuckThresholdMs: 10000
    useSeekGhosting: true
    youtubePlaylistLoadLimit: 6
    playerUpdateInterval: 5
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true
    gc-warnings: true

metrics:
  prometheus:
    enabled: false
    endpoint: /metrics

sentry:
  dsn: ""
  environment: ""

logging:
  file:
    path: ./logs/
  level:
    root: INFO
    lavalink: INFO
  logback:
    rollingpolicy:
      max-file-size: 25MB
      max-history: 7
`.trim()
};

export const pluginsGitkeepTemplate = {
	name: ".gitkeep",
	path: "lavalink/plugins",
	content: ""
};

// ============================================
// Module Updates
// ============================================

export function lavalinkModuleUpdates(withConfigModule: boolean) {
	return {
		importLavalink: {
			replacer: 'import { NecordModule } from "necord";',
			content: `import { NecordModule } from "necord";
import { NecordLavalinkModule } from "@necord/lavalink";`
		},
		importCommands: {
			replacer: 'import { NecordCommand } from "./necord.command";',
			content: `import { NecordCommand } from "./necord.command";
import { PlayCommand } from "./commands/play/play.command";
import { LavalinkListenersService } from "./lavalink-listeners.service";`
		},
		providers: {
			replacer: "providers: [NecordService, NecordCommand]",
			content: "providers: [NecordService, NecordCommand, PlayCommand, LavalinkListenersService]"
		}
	};
}
