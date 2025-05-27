import { NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";
import type { ModuleTemplate } from "../../generators/module.service";
import { GraphQLConstants } from "./constants.template";
import { GraphQLModuleTemplate } from "./module.template";
import { GraphQLResolverTemplate } from "./resolver.template";

export function GraphQLTemplates(mainType: "fastify" | "express"): ModuleTemplate {
	return {
		name: "graphql",
		templates: [GraphQLResolverTemplate],
		filesToUpdate: [GraphQLModuleTemplate],
		constants: GraphQLConstants,
		packages: [
			{
				...NPM_DEPENDENCIES["@nestjs/graphql"],
				dev: false
			},
			{
				...NPM_DEPENDENCIES["@nestjs/apollo"],
				dev: false
			},
			{
				...NPM_DEPENDENCIES["@apollo/server"],
				dev: false
			},
			{
				...NPM_DEPENDENCIES["graphql"],
				dev: false
			},
			...(mainType === "fastify"
				? [
						{
							...NPM_DEPENDENCIES["@as-integrations/fastify"],
							dev: false
						}
					]
				: [])
		]
	};
}
