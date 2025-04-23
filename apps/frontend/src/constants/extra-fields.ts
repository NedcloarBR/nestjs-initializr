export const extraFields = (t: (arg: string) => string) => [
	{ name: "cors", title: t("Extra.extras.cors.title"), description: t("Extra.extras.cors.description") },
	{ name: "helmet", title: t("Extra.extras.helmet.title"), description: t("Extra.extras.helmet.description") },
	{
		name: "validation",
		title: t("Extra.extras.validation.title"),
		description: t("Extra.extras.validation.description")
	},
	{
		name: "compression",
		title: t("Extra.extras.compression.title"),
		description: t("Extra.extras.compression.description")
	}
];
