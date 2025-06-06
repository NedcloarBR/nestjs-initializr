import { ConfigTemplates } from "./config";
import { GraphQLTemplates } from "./graphql";
import { NecordTemplates } from "./necord/core";
import { NecordLavalinkTemplates } from "./necord/lavalink";
import { NecordLocalizationTemplates } from "./necord/localization";
import { NecordPaginationTemplates } from "./necord/pagination";
import { NestWhatsTemplates } from "./nestwhats";
import { JestTemplates } from "./test/jest";

export function modulesTemplates(withConfigModule: boolean, mainType: "fastify" | "express") {
	return [
		ConfigTemplates(mainType),
		NecordTemplates(withConfigModule),
		NecordLocalizationTemplates(withConfigModule),
		NecordPaginationTemplates(withConfigModule),
		NecordLavalinkTemplates(withConfigModule),
		NestWhatsTemplates,
		GraphQLTemplates(mainType),
		JestTemplates
	];
}
