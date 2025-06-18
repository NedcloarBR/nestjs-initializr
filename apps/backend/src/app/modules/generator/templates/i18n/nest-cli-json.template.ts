export const nestCliJsonTemplate = {
	name: "nest-cli.json",
	path: "",
	templates: [
		{
			replacer: '"compilerOptions": {',
			content: '"compilerOptions": { "assets": [{ "include": "modules/i18n/locales/**/*", "watchAssets": true }],'
		}
	]
};
