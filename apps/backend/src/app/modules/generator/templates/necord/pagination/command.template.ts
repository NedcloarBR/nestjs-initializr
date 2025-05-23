export const commandTemplate = {
	path: "src/modules/necord",
	name: "necord.command.ts",
	templates: [
		{
			replacer: 'return interaction.reply({ content: "Pong!" }); \n}',
			content: `
          return interaction.reply({ content: "Pong!" });
        }
        @SlashCommand({ name: "pagination", description: "Test pagination" })
        public async onPagination(@Context() [interaction]: SlashCommandContext) {
          const pagination = this.paginationService.get("test");
          const page = await pagination.build();

          return interaction.reply(page);
        }
      `
		}
	]
};
