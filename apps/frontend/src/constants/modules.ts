export const modules = (t: (args: string) => string) =>
	[
		{
			title: "@nestjs/config",
			name: "config",
			description: t("Modules.config.description"),
			iconType: "svg"
		},
		{ title: "Swagger", name: "swagger", description: t("Modules.swagger.description"), iconType: "svg" },
		{ title: "Necord", name: "necord", description: t("Modules.necord.description"), iconType: "svg" },
		{
			title: "@necord/localization",
			name: "necord-localization",
			description: t("Modules.necord-localization.description"),
			dependsOn: "necord",
			iconType: "svg"
		},
		{
			title: "@necord/pagination",
			name: "necord-pagination",
			description: t("Modules.necord-pagination.description"),
			dependsOn: "necord",
			iconType: "svg"
		},
		{
			title: "@necord/lavalink",
			name: "necord-lavalink",
			description: t("Modules.necord-lavalink.description"),
			dependsOn: "necord",
			iconType: "svg"
		}
	] as {
		title: string;
		name: string;
		description: string;
		iconType: "svg" | "png";
		dependsOn?: string | string[];
	}[];

export const moduleDependencies: Record<string, string[]> = {
	"necord-localization": ["necord"],
	"necord-pagination": ["necord"],
	"necord-lavalink": ["necord"]
};

export const dockerRequiredModules = ["necord-lavalink"];
