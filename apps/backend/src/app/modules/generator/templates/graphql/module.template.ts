export const GraphQLModuleTemplate = {
	path: "src",
	name: "app.module.ts",
	templates: [
		{
			replacer: 'import { Module } from "@nestjs/common";',
			content:
				'import { Module } from "@nestjs/common";\nimport { GraphQLModule } from "@nestjs/graphql";\nimport { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";\nimport path from "node:path";\nimport { AppResolver } from "./app.resolver"'
		},
		{
			replacer: "providers: [",
			content: "providers: [AppResolver,"
		}
	]
};
