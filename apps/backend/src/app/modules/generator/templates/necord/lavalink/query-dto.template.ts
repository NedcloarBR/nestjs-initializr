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
        description: "source of the track",
        autocomplete: true,
        required: false,
      })
      public readonly source?: SourcePlatform;
    }
  `
};
