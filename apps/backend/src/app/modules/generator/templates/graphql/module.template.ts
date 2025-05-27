export const GraphQLModuleTemplate = {
	path: "src",
	name: "app.module.ts",
	templates: [
		{
			replacer: 'import { Module } from  "@nestjs/commom"',
			content:
				'import { Module } from  "@nestjs/commom";\nimport { GraphQLModule } from "@nestjs/graphql";\nimport { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";\nimport path from "node:path";'
		},
		{
			replacer: "],",
			content: `\nGraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: path.resolve(process.cwd(), "src/schema.gql")
        }),\n],
        `
		}
	]
};
