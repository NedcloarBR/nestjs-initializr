import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { graphqlAppModuleUpdates, graphqlResolverTemplate } from "./templates";

/**
 * GraphQL Plugin - Generates GraphQL module with Apollo Server
 *
 * This plugin creates:
 * - src/app.resolver.ts (example resolver)
 * - Updates app.module.ts with GraphQL configuration
 *
 * Supports both Fastify and Express adapters
 */
@Plugin({
	name: "graphql",
	displayName: "GraphQL",
	description: "GraphQL API with Apollo Server and code-first approach",
	priority: 500
})
export class GraphQLPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.modules?.includes("graphql") ?? false;
	}

	protected onGenerate(): void {
		this.createFile(graphqlResolverTemplate.name, graphqlResolverTemplate.path, graphqlResolverTemplate.content);

		this.replaceInFile(
			"src",
			"app.module.ts",
			graphqlAppModuleUpdates.imports.replacer,
			graphqlAppModuleUpdates.imports.content
		);

		this.replaceInFile(
			"src",
			"app.module.ts",
			graphqlAppModuleUpdates.providers.replacer,
			graphqlAppModuleUpdates.providers.content
		);

		this.replaceInFile(
			"src",
			"app.module.ts",
			graphqlAppModuleUpdates.importsArray.replacer,
			graphqlAppModuleUpdates.importsArray.content
		);

		this.addPkg("@nestjs/graphql");
		this.addPkg("@nestjs/apollo");
		this.addPkg("@apollo/server");
		this.addPkg("graphql");

		if (this.isFastify) {
			this.addPkg("@as-integrations/fastify");
		}

		this.setConstants({
			token: null,
			import: null,
			export: null,
			importArray: `GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), "src/schema.gql")
    })`,
			inject: null,
			importIn: "src/app.module.ts"
		});
	}
}
