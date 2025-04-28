import { ConfigTemplates } from "./config";

export function modulesTemplates(withConfigModule: boolean, mainType: "fastify" | "express") {
	return [ConfigTemplates(mainType)];
}
