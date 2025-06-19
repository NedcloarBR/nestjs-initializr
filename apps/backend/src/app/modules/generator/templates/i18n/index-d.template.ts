export const indexDTemplate = {
	name: "index.d.ts",
	path: "src/types",
	templates: [
		{
			replacer: "GLOBAL_PREFIX: string;",
			content: "GLOBAL_PREFIX: string;\nI18N_FALLBACK_LANGUAGE: string;"
		}
	]
};
