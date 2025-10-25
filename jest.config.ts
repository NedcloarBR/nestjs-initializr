import { getJestProjectsAsync } from "@nx/jest";
import type { Config } from "jest";

// biome-ignore lint/style/noDefaultExport: <>
export default async (): Promise<Config> => ({
	projects: await getJestProjectsAsync()
});
