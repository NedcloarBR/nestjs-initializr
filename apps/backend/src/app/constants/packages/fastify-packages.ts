import { NPM_DEPENDENCIES } from "./npm-packages";

export const fastifyPackages = [
	{
		name: NPM_DEPENDENCIES["@nestjs/platform-fastify"].name,
		version: NPM_DEPENDENCIES["@nestjs/platform-fastify"].version,
		dev: false
	},
	{
		name: NPM_DEPENDENCIES.fastify.name,
		version: NPM_DEPENDENCIES.fastify.version,
		dev: false
	}
];
