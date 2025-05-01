export const NecordCommandTemplate = {
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
    }
  `
};
