export const indexDTemplate = {
	name: "index.d.ts",
	path: "src/types",
	templates: [
		{
			replacer: "GLOBAL_PREFIX: string;",
			content: "GLOBAL_PREFIX: string;\nDISCORD_TOKEN: string;\nDISCORD_DEVELOPMENT_GUILD_ID: string;"
		}
	]
};
