import { DEV_NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";

export const BiomeTemplate = {
	packages: [
		{
			name: DEV_NPM_DEPENDENCIES["@biomejs/biome"].name,
			version: DEV_NPM_DEPENDENCIES["@biomejs/biome"].version,
			dev: true
		},
		{
			name: DEV_NPM_DEPENDENCIES["@nedcloarbr/biome-config"].name,
			version: DEV_NPM_DEPENDENCIES["@nedcloarbr/biome-config"].version,
			dev: true
		}
	],
	templates: [
		{
			name: "biome.json",
			path: "",
			content: `
        {
          "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
          "extends": ["@nedcloarbr/biome-config/nestjs"]
        }
      `
		}
	]
};
