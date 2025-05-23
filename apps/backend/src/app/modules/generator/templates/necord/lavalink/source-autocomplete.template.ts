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
        let choices: string[];
        if (focused.name === "source") {
          choices = [DefaultSources.soundcloud]
        }
        return interaction.respond(
        choices
          .filter((choice) => choice.startsWith(focused.value.toString()))
          .map((choice) => ({ name: choice, value: choice })),
        );
      }
    }
  `
};
