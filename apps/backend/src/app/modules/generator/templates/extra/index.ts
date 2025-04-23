import { NPM_DEPENDENCIES } from "apps/backend/src/app/constants/packages";
import { compression } from "./compression";
import { cors } from "./cors";
import { helmet } from "./helmet";
import { validation } from "./validation";

export function extrasMetadata(mainType: "fastify" | "express", withConfigModule: boolean) {
	return {
		helmet: {
			templates: helmet(mainType, withConfigModule),
			packages: mainType === "fastify" ? [NPM_DEPENDENCIES["@fastify/helmet"]] : [NPM_DEPENDENCIES["helmet"]]
		},
		cors: {
			templates: cors(withConfigModule)
		},
		validation: {
			templates: validation(withConfigModule),
			packages: [NPM_DEPENDENCIES["class-validator"], NPM_DEPENDENCIES["class-transformer"]]
		},
		compression: {
			templates: compression(mainType, withConfigModule),
			packages: mainType === "fastify" ? [NPM_DEPENDENCIES["@fastify/compress"]] : [NPM_DEPENDENCIES["compression"]]
		}
	};
}
