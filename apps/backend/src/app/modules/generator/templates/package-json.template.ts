export enum PackageJsonReplaceKeys {
	PROJECT_NAME = "{{PROJECT_NAME}}",
	PROJECT_DESCRIPTION = "{{PROJECT_DESCRIPTION}}",
	NODE_VERSION = "{{NODE_VERSION}}"
}

export const PackageJsonTemplate = {
	name: "package.json",
	path: "",
	content: `
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
  `
};
