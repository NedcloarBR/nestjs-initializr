import type { MetadataDTO } from "../dtos/metadata.dto";
import { ConfigTemplates } from "./config";
import { GraphQLTemplates } from "./graphql";
import { HuskyTemplates } from "./husky";
import { NecordTemplates } from "./necord/core";
import { NecordLavalinkTemplates } from "./necord/lavalink";
import { NecordLocalizationTemplates } from "./necord/localization";
import { NecordPaginationTemplates } from "./necord/pagination";
import { NestWhatsTemplates } from "./nestwhats";
import { JestTemplates } from "./test/jest";
import { VitestTemplates } from "./test/vitest";

export function modulesTemplates(
	withConfigModule: boolean,
	mainType: MetadataDTO["mainType"],
	packageManager: MetadataDTO["packageManager"],
	linterFormatter: MetadataDTO["linterFormatter"]
) {
	return [
		ConfigTemplates(mainType),
		NecordTemplates(withConfigModule),
		NecordLocalizationTemplates(withConfigModule),
		NecordPaginationTemplates(withConfigModule),
		NecordLavalinkTemplates(withConfigModule),
		NestWhatsTemplates,
		GraphQLTemplates(mainType),
		JestTemplates,
		VitestTemplates,
		HuskyTemplates(packageManager, linterFormatter)
	];
}
