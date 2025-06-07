export const GraphQLConstants = {
	token: null,
	import: null,
	export: null,
	importArray: `
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), "src/schema.gql")
    })
  `,
	inject: null,
	importIn: "src/app.module.ts"
};
