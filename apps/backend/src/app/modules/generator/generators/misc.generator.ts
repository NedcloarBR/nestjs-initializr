import { nestjsCli } from "../templates/misc/nestjs-cli";
import { readme } from "../templates/misc/readme";
import { tsconfig, tsconfigBuild } from "../templates/misc/tsconfig";
import { BaseGenerator } from "./base/base.generator";

export function MiscGenerator(id: string) {
	const tsconfigFile = BaseGenerator(id, tsconfig, true);
	const tsconfigBuildFile = BaseGenerator(id, tsconfigBuild, true);
	const nestjsCliFile = BaseGenerator(id, nestjsCli, true);
	const readmeFile = BaseGenerator(id, readme, true);
	return [tsconfigFile, tsconfigBuildFile, nestjsCliFile, readmeFile];
}
