export const JSONLocaleLoaderTemplate = {
	name: "JSONLocale.loader.ts",
	path: "src/modules/necord",
	content: `
    import fs from "node:fs";
    import path from "node:path";

    export class JSONLocaleLoader {
	    public constructor(private readonly path: string) {}

	    private ignoredFoldersAndFiles = []; // Add any non json files and folder in same directory of translations

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
  `
};
