import { ModuleCategory, type ModuleType } from "@/types/module";

const rawModules = [
	{
		title: "@nestjs/config",
		name: "config",
		descriptionKey: "Modules.config.description",
		iconType: "svg",
		category: ModuleCategory.CONFIG
	},
	{
		title: "Swagger",
		name: "swagger",
		descriptionKey: "Modules.swagger.description",
		iconType: "svg",
		category: ModuleCategory.DOCUMENTATION
	},
	{
		title: "Necord",
		name: "necord",
		descriptionKey: "Modules.necord.description",
		iconType: "svg",
		category: ModuleCategory.UTILITY
	},
	{
		title: "@necord/localization",
		name: "necord-localization",
		descriptionKey: "Modules.necord-localization.description",
		dependsOn: "necord",
		iconType: "svg",
		category: ModuleCategory.UTILITY
	},
	{
		title: "@necord/pagination",
		name: "necord-pagination",
		descriptionKey: "Modules.necord-pagination.description",
		dependsOn: "necord",
		iconType: "svg",
		category: ModuleCategory.UTILITY
	},
	{
		title: "@necord/lavalink",
		name: "necord-lavalink",
		descriptionKey: "Modules.necord-lavalink.description",
		dependsOn: "necord",
		iconType: "svg",
		category: ModuleCategory.UTILITY
	},
	{
		title: "NestWhats",
		name: "nestwhats",
		descriptionKey: "Modules.nestwhats.description",
		iconType: "svg",
		category: ModuleCategory.UTILITY
	},
	{
		title: "GraphQL",
		name: "graphql",
		descriptionKey: "Modules.graphql.description",
		iconType: "svg",
		category: ModuleCategory.INFRA
	},
	{
		title: "Husky",
		name: "husky",
		descriptionKey: "Modules.husky.description",
		iconType: "svg",
		category: ModuleCategory.CONFIG
	},
	{
		title: "NestJS i18n",
		name: "nestjs-i18n",
		descriptionKey: "Modules.nestjs-i18n.description",
		iconType: "svg",
		category: ModuleCategory.UTILITY
	},
	{
		title: "Scalar API Reference",
		name: "scalar-api-reference",
		descriptionKey: "Modules.scalar-api-reference.description",
		dependsOn: "swagger",
		iconType: "png",
		category: ModuleCategory.DOCUMENTATION
	}
] as const;

export type ModuleName = (typeof rawModules)[number]["name"];

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
	"necord-lavalink": ["necord"],
	"scalar-api-reference": ["swagger"]
};

export const dockerRequiredModules: ModuleName[] = ["necord-lavalink"];

export const linterFormatterRequiredModules: ModuleName[] = ["husky"];
