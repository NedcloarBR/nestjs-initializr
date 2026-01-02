type StaticTemplate = {
	name: string;
	path: string;
	content: string;
};

type DynamicTemplate = (mainType: "fastify" | "express") => StaticTemplate;

export type Template = StaticTemplate | DynamicTemplate;

export type ModuleTemplate = {
	name: string;
	templates: Template[];
	constants?: {
		token?: string;
		import?: string;
		export?: string;
		importArray?: string;
		inject?: string;
		importIn?: string;
	};
	mainTemplates?: { replacer: string; content: string }[];
	filesToUpdate?: { path: string; name: string; templates: { replacer: string; content: string }[] }[];
	packages?: { name: string; version: string; dev: boolean }[];
	scripts?: { name: string; command: string }[];
};

export type ModuleNames =
	| "config"
	| "graphql"
	| "husky"
	| "i18n"
	| "necord"
	| "necord-lavalink"
	| "necord-localization"
	| "necord-pagination"
	| "nestwhats"
	| "swagger"
	| "scalar-api-reference"
	| "toolkit";

export type ExtraNames = "compression" | "cors" | "helmet" | "validation";
