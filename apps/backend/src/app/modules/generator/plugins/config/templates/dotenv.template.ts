import type { StaticTemplate } from "@/types";

export const dotenvTemplate: StaticTemplate = {
	name: ".env",
	path: "",
	content: `
NODE_ENV=development
PORT=4404
GLOBAL_PREFIX=api
`.trim()
};
