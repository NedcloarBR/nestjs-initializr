import { type Dependency, ModuleCategory, type ModuleType } from "@/types/module";

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
	},
	{
		title: "@nedcloarbr/nestjs-toolkit",
		name: "nestjs-toolkit",
		descriptionKey: "Modules.nestjs-toolkit.description",
		iconType: "svg",
		category: ModuleCategory.UTILITY
	},
	{
		title: "nestjs-prisma",
		name: "nestjs-prisma",
		descriptionKey: "Modules.nestjs-prisma.description",
		iconType: "svg",
		category: ModuleCategory.DATABASE,
		conflicts: ["prisma-standalone"]
	},
	{
		title: "Prisma Standalone",
		name: "prisma-standalone",
		descriptionKey: "Modules.prisma-standalone.description",
		iconType: "svg",
		category: ModuleCategory.DATABASE,
		conflicts: ["nestjs-prisma"]
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

export const moduleDependencies: Partial<Record<ModuleName, Dependency>> = {
	"necord-localization": { type: "AND", modules: ["necord"] },
	"necord-pagination": { type: "AND", modules: ["necord"] },
	"necord-lavalink": { type: "AND", modules: ["necord"] },
	"scalar-api-reference": { type: "AND", modules: ["swagger"] }
};

export const dockerRequiredModules: ModuleName[] = ["necord-lavalink", "prisma-standalone", "nestjs-prisma"];

export const moduleConflicts: Record<string, ModuleName[]> = {
	"nestjs-prisma": ["prisma-standalone"],
	"prisma-standalone": ["nestjs-prisma"]
};

export const linterFormatterRequiredModules: ModuleName[] = ["husky"];

export const databaseModules: ModuleName[] = ["prisma-standalone", "nestjs-prisma"];
