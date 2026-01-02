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
		// Create resolver file
		this.createFile(graphqlResolverTemplate.name, graphqlResolverTemplate.path, graphqlResolverTemplate.content);

		// Update app.module.ts with GraphQL imports
		this.replaceInFile(
			"src",
			"app.module.ts",
			graphqlAppModuleUpdates.imports.replacer,
			graphqlAppModuleUpdates.imports.content
		);

		// Add AppResolver to providers
		this.replaceInFile(
			"src",
			"app.module.ts",
			graphqlAppModuleUpdates.providers.replacer,
			graphqlAppModuleUpdates.providers.content
		);

		// Add GraphQLModule to imports array
		this.replaceInFile(
			"src",
			"app.module.ts",
			graphqlAppModuleUpdates.importsArray.replacer,
			graphqlAppModuleUpdates.importsArray.content
		);

		// Add dependencies
		this.addPkg("@nestjs/graphql");
		this.addPkg("@nestjs/apollo");
		this.addPkg("@apollo/server");
		this.addPkg("graphql");

		// Add Fastify integration if using Fastify
		if (this.isFastify) {
			this.addPkg("@as-integrations/fastify");
		}

		// Set constants for other plugins
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
