import type { StaticTemplate } from "@/types";

export const servicesConstantTemplate: StaticTemplate = {
	name: "services.ts",
	path: "src/constants",
	content: `
export const Services = Object.freeze({
  Config: Symbol("CONFIG_SERVICE"),
});
`.trim()
};

export const configIndexTemplate: StaticTemplate = {
	name: "index.ts",
	path: "src/modules/config",
	content: `
export { ConfigModule } from "./config.module";
export { ConfigService } from "./config.service";
`.trim()
};

export const modulesIndexTemplate: StaticTemplate = {
	name: "index.ts",
	path: "src/modules",
	content: `
export { ConfigModule } from "./config/config.module";
`.trim()
};
