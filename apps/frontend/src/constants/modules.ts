const rawModules = [
	{
		title: "@nestjs/config",
		name: "config",
		descriptionKey: "Modules.config.description",
		iconType: "svg"
	},
	{
		title: "Swagger",
		name: "swagger",
		descriptionKey: "Modules.swagger.description",
		iconType: "svg"
	},
	{
		title: "Necord",
		name: "necord",
		descriptionKey: "Modules.necord.description",
		iconType: "svg"
	},
	{
		title: "@necord/localization",
		name: "necord-localization",
		descriptionKey: "Modules.necord-localization.description",
		dependsOn: "necord",
		iconType: "svg"
	},
	{
		title: "@necord/pagination",
		name: "necord-pagination",
		descriptionKey: "Modules.necord-pagination.description",
		dependsOn: "necord",
		iconType: "svg"
	},
	{
		title: "@necord/lavalink",
		name: "necord-lavalink",
		descriptionKey: "Modules.necord-lavalink.description",
		dependsOn: "necord",
		iconType: "svg"
	},
	{
		title: "NestWhats",
		name: "nestwhats",
		descriptionKey: "Modules.nestwhats.description",
		iconType: "svg"
	},
	{
		title: "GraphQL",
		name: "graphql",
		descriptionKey: "Modules.graphql.description",
		iconType: "svg"
	},
	{
		title: "Husky",
		name: "husky",
		descriptionKey: "Modules.husky.description",
		iconType: "svg"
	}
] as const;

export type ModuleName = (typeof rawModules)[number]["name"];
type ModuleType = {
	title: string;
	name: ModuleName;
	descriptionKey: string;
	iconType: "svg" | "png";
	dependsOn?: ModuleName | ModuleName[];
};

export const modules = (t: (key: string) => string) => {
	const newModules = (rawModules as unknown as ModuleType[]).map((mod) => ({
		...mod,
		description: t(mod.descriptionKey)
	}));
	return newModules;
};

export const moduleDependencies: Record<string, ModuleName[]> = {
	"necord-localization": ["necord"],
	"necord-pagination": ["necord"],
	"necord-lavalink": ["necord"]
};

export const dockerRequiredModules: ModuleName[] = ["necord-lavalink"];

export const linterFormatterRequiredModules: ModuleName[] = ["husky"];
