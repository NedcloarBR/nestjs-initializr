export const GraphQLResolverTemplate = {
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
  `
};
