export const content = `
{
  "name": "{{PROJECT_NAME}}",
	"description": "{{PROJECT_DESCRIPTION}}",
	"license": "MIT",
	"version": "0.0.1",
	"private": true,
	"engines": {
		"node": ">={{NODE_VERSION}}"
	},
	"scripts": {},
	"dependencies": {},
	"devDependencies": {}
}
`;

export enum packageJsonReplaceKeys {
	PROJECT_NAME = "{{PROJECT_NAME}}",
	PROJECT_DESCRIPTION = "{{PROJECT_DESCRIPTION}}",
	NODE_VERSION = "{{NODE_VERSION}}"
}

export const packageJsonTemplate = {
	name: "package.json",
	path: "",
	content
};
