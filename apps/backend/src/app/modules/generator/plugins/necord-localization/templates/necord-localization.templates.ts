/**
 * Necord Localization templates - i18n for Discord bots
 */

// ============================================
// JSON Locale Loader Template
// ============================================

export const jsonLocaleLoaderTemplate = {
	name: "JSONLocale.loader.ts",
	path: "src/modules/necord",
	content: `
import fs from "node:fs";
import path from "node:path";

export class JSONLocaleLoader {
  public constructor(private readonly path: string) {}

  private ignoredFoldersAndFiles = [];

  public async loadTranslations() {
    const locales: Record<string, Record<string, string>> = {};
    const folders = fs
      .readdirSync(this.path)
      .filter((f) => !this.ignoredFoldersAndFiles.includes(f));

    for (const langFolder of folders) {
      const langPath = path.join(this.path, langFolder);
      const namespaces = fs
        .readdirSync(langPath)
        .filter((f) => !this.ignoredFoldersAndFiles.includes(f));
      const langData = {};

      for (const namespace of namespaces) {
        const namespacePath = path.join(langPath, namespace);
        const files = fs
          .readdirSync(namespacePath)
          .filter((f) => !this.ignoredFoldersAndFiles.includes(f));
        const namespaceData = {};

        for (const file of files) {
          const filePath = path.join(namespacePath, file);
          if (path.extname(file) !== ".json") continue;

          const jsonContent = fs.readFileSync(filePath, "utf-8");
          const jsonData = JSON.parse(jsonContent);
          namespaceData[file.replace(".json", "")] = jsonData;
        }

        langData[namespace] = namespaceData;
      }

      locales[langFolder] = langData;
    }
    return locales;
  }
}
`.trim()
};

// ============================================
// Ping Translation Template
// ============================================

export const pingTranslationTemplate = {
	name: "ping.json",
	path: "src/common/localization/necord/en-US/commands",
	content: `
{
  "name": "Ping",
  "description": "Pong!"
}
`.trim()
};

// ============================================
// File Updates
// ============================================

export function necordLocalizationModuleUpdates(withConfigModule: boolean) {
	return {
		moduleImport: {
			replacer: 'import { NecordModule } from "necord";',
			content: `import { NecordModule } from "necord";
import { ${withConfigModule ? "" : "GuildResolver, "}NecordLocalizationModule${withConfigModule ? "" : ", NestedLocalizationAdapter"} } from "@necord/localization";`
		},
		moduleConfig: {
			replacer: "providers: [NecordService, NecordCommand]",
			content: withConfigModule
				? `imports: [
    // ... existing imports
    NecordLocalizationModule.forRootAsync({
      inject: [Services.Config],
      useClass: NecordConfig
    })
  ],
  providers: [NecordService, NecordCommand]`
				: `imports: [
    // ... existing imports
    NecordLocalizationModule.forRoot({
      resolvers: GuildResolver,
      adapter: new NestedLocalizationAdapter({
        fallbackLanguage: "en-US",
        locales: {
          "en-US": {
            "commands": {
              "ping": {
                name: "ping",
                description: "Pong!"
              }
            }
          }
        }
      })
    })
  ],
  providers: [NecordService, NecordCommand]`
		}
	};
}

export const necordLocalizationCommandUpdates = {
	import: {
		replacer: 'import { Injectable } from "@nestjs/common";',
		content: `import { Injectable } from "@nestjs/common";
import { CurrentTranslate, localizationMapByKey, TranslationFn } from "@necord/localization";`
	},
	description: {
		replacer: 'description: "Pong!"',
		content: `description: "Pong!",
    nameLocalizations: localizationMapByKey("commands.ping.name"),
    descriptionLocalizations: localizationMapByKey("commands.ping.description")`
	},
	context: {
		replacer: "@Context() [interaction]: SlashCommandContext",
		content: "@Context() [interaction]: SlashCommandContext, @CurrentTranslate() t: TranslationFn"
	},
	reply: {
		replacer: 'return interaction.reply({ content: "Pong!" });',
		content: `const message = t("commands.ping.description");
    return interaction.reply(message);`
	}
};
