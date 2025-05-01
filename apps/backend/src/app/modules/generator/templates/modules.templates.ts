import { ConfigTemplates } from "./config";
import { NecordTemplates } from "./necord/core";
import { NecordLavalinkTemplates } from "./necord/lavalink";
import { NecordLocalizationTemplates } from "./necord/localization";
import { NecordPaginationTemplates } from "./necord/pagination";
import { NestWhatsTemplates } from "./nestwhats";

export function modulesTemplates(withConfigModule: boolean, mainType: "fastify" | "express") {
	return [
		ConfigTemplates(mainType),
		NecordTemplates(withConfigModule),
		NecordLocalizationTemplates(withConfigModule),
		NecordPaginationTemplates(withConfigModule),
		NecordLavalinkTemplates(withConfigModule),
		NestWhatsTemplates
	];
}
