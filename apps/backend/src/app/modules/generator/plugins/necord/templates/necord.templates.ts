/**
 * Necord Core templates - Discord bot framework for NestJS
 */

export function necordModuleTemplate(withConfigModule: boolean) {
	return {
		name: "necord.module.ts",
		path: "src/modules/necord",
		content: `
import { Module } from "@nestjs/common";
${withConfigModule ? 'import { Services } from "@/constants/services";' : ""}
import { NecordModule } from "necord";
import { NecordService } from "./necord.service";
import { NecordCommand } from "./necord.command";
${withConfigModule ? 'import { NecordConfig } from "./necord.config";' : ""}
${withConfigModule ? "" : "import { IntentsBitField } from 'discord.js';"}

@Module({
  imports: [
    NecordModule.${
			withConfigModule
				? `forRootAsync({
      inject: [Services.Config],
      useClass: NecordConfig
    })`
				: `forRoot({
      token: process.env.DISCORD_TOKEN,
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
      ],
      development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID]
    })`
		}
  ],
  providers: [NecordService, NecordCommand]
})
export class NecordWrapperModule {}
`.trim()
	};
}

export const necordServiceTemplate = {
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
`.trim()
};

export const necordCommandTemplate = {
	name: "necord.command.ts",
	path: "src/modules/necord",
	content: `
import { Injectable } from "@nestjs/common";
import { Context, SlashCommand, SlashCommandContext } from "necord";

@Injectable()
export class NecordCommand {
  @SlashCommand({
    name: "ping",
    description: "Pong!"
  })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: "Pong!" });
  }

  //MoreOptions?
}
`.trim()
};

export const necordConfigTemplate = {
	name: "necord.config.ts",
	path: "src/modules/necord",
	content: `
import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@/modules/config/config.service";
import { Services } from "@/constants/services";
import type { NecordModuleOptions } from "necord";
import { IntentsBitField } from 'discord.js';

@Injectable()
export class NecordConfig {
  public constructor(@Inject(Services.Config) private config: ConfigService) {}

  public createNecordOptions(): NecordModuleOptions {
    return {
      token: this.config.get("DISCORD_TOKEN"),
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
      ],
      development: this.config.get("DISCORD_DEVELOPMENT_GUILD_ID")
    };
  }

  // MoreOptions?
}
`.trim()
};

export const necordEnvDtoTemplate = {
	name: "discord-env.dto.ts",
	path: "src/modules/necord/dtos",
	content: `
import { registerAs } from "@nestjs/config";
import { IsString, IsNotEmpty } from "class-validator";
import validateConfig from "@/modules/config/config.validator";

export class DiscordEnvDTO {
  @IsString()
  @IsNotEmpty()
  public readonly DISCORD_TOKEN!: string;

  @IsString()
  @IsNotEmpty()
  public readonly DISCORD_DEVELOPMENT_GUILD_ID!: string[];

  //MoreOptions?
}

export default registerAs("discord_env", () => {
  validateConfig(process.env, DiscordEnvDTO);

  return {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || "",
    DISCORD_DEVELOPMENT_GUILD_ID: [process.env.DISCORD_DEVELOPMENT_GUILD_ID]
    //MoreOptions_
  };
});
`.trim()
};

export const necordFileUpdates = {
	dotenv: {
		content: "DISCORD_TOKEN=\nDISCORD_DEVELOPMENT_GUILD_ID="
	}
};

export const necordConfigIntegration = {
	indexDTs: {
		replacer: "GLOBAL_PREFIX: string;",
		content: "GLOBAL_PREFIX: string;\n    DISCORD_TOKEN: string;\n    DISCORD_DEVELOPMENT_GUILD_ID: string;"
	},
	configModuleImport: {
		replacer: 'import EnvConfig from "./dtos/env.dto"',
		content:
			'import EnvConfig from "./dtos/env.dto";\nimport DiscordEnvConfig from "@/modules/necord/dtos/discord-env.dto";'
	},
	configModuleLoad: {
		replacer: "load: [EnvConfig",
		content: "load: [EnvConfig, DiscordEnvConfig"
	},
	configServiceImport: {
		replacer: 'import { EnvDTO } from "./dtos/env.dto";',
		content:
			'import { EnvDTO } from "./dtos/env.dto";\nimport { DiscordEnvDTO } from "@/modules/necord/dtos/discord-env.dto";'
	},
	configServiceType: {
		replacer: "InstanceType<typeof EnvDTO>",
		content: "InstanceType<typeof EnvDTO> & InstanceType<typeof DiscordEnvDTO>"
	}
};
