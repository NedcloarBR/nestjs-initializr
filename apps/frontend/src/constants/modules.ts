export const modules = (t: (args: string) => string) => [
	{
		title: "@nestjs/config",
		name: "config",
		description: t("Modules.config.description")
	},
	{ title: "Swagger", name: "swagger", description: t("Modules.swagger.description") }
];
