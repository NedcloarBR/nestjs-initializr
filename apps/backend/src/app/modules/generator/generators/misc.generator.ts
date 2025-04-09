import { BaseGenerator } from ".";
import { nestjsCli, readmeTemplate, tsconfig, tsconfigBuild } from "../templates";

export function RootGenerator(id: string) {
	const tsconfigFile = BaseGenerator(id, tsconfig, true);
	const tsconfigBuildFile = BaseGenerator(id, tsconfigBuild, true);
	const nestjsCliFile = BaseGenerator(id, nestjsCli, true);
	const readmeFile = BaseGenerator(id, readmeTemplate, true);
	return [tsconfigFile, tsconfigBuildFile, nestjsCliFile, readmeFile];
}
