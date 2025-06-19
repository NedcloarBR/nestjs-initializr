export const indexDTemplate = {
	name: "index.d.ts",
	path: "src/types",
	templates: [
		{
			replacer: "GLOBAL_PREFIX: string;",
			content: "GLOBAL_PREFIX: string;\nLAVALINK_AUTHORIZATION: string;\nLAVALINK_HOST: string;\nLAVALINK_PORT: number;"
		}
	]
};
