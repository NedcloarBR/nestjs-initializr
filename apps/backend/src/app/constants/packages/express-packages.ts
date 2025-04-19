import { NPM_DEPENDENCIES } from "./npm-packages";

export const expressPackages = [
	{
		name: NPM_DEPENDENCIES["@nestjs/platform-express"].name,
		version: NPM_DEPENDENCIES["@nestjs/platform-express"].version,
		dev: false
	},
	{
		name: NPM_DEPENDENCIES["express"].name,
		version: NPM_DEPENDENCIES["express"].version,
		dev: false
	}
];
