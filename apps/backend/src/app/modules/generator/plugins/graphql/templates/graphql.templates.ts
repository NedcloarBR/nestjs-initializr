/**
 * GraphQL templates - Generates GraphQL module with Apollo Server
 */

// ============================================
// Resolver Template
// ============================================

export const graphqlResolverTemplate = {
	name: "app.resolver.ts",
	path: "src",
	content: `
import { Query, Resolver } from "@nestjs/graphql";
import { AppService } from "./app.service";

@Resolver()
export class AppResolver {
  public constructor(private readonly appService: AppService) {}

  @Query(() => String)
  public hello(): string {
    return this.appService.getHello();
  }
}
`.trim()
};

// ============================================
// App Module Updates
// ============================================

export const graphqlAppModuleUpdates = {
	imports: {
		replacer: 'import { Module } from "@nestjs/common";',
		content: `import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import path from "node:path";
import { AppResolver } from "./app.resolver";`
	},
	providers: {
		replacer: "providers: [",
		content: "providers: [AppResolver, "
	},
	importsArray: {
		replacer: "imports: [",
		content: `imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), "src/schema.gql")
    }),`
	}
};

// ============================================
// Config Module Integration (when config is enabled)
// ============================================

export const graphqlWithConfigUpdates = {
	imports: {
		replacer: 'import { Module } from "@nestjs/common";',
		content: `import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import path from "node:path";
import { AppResolver } from "./app.resolver";`
	},
	providers: {
		replacer: "providers: [",
		content: "providers: [AppResolver, "
	}
};
