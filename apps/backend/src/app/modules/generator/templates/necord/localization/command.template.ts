export const commandTemplate = {
	path: "src/modules/necord",
	name: "necord.command.ts",
	templates: [
		{
			replacer: 'import { Injectable } from "@nestjs/common";',
			content:
				'import { Injectable, Inject } from "@nestjs/common";\nimport { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";'
		},
		{
			replacer: 'description: "Pong!"',
			content:
				'description: "Pong!"\nnameLocalizations: localizationMapByKey("commands.ping.name"),\ndescriptionLocalizations: localizationMapByKey("commands.ping.description"),'
		},
		{
			replacer: "@Context() [interaction]: SlashCommandContext",
			content: "@Context() [interaction]: SlashCommandContext, @CurrentTranslate() t: TranslationFn"
		},
		{
			replacer: 'return interaction.reply({ content: "Pong!" });',
			content: `
        const message = t("commands.ping.description");
        return interaction.reply(message);
      `
		}
	]
};
