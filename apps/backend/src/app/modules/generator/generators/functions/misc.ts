import { nestjsCli } from "../../templates/misc/nestjs-cli";
import { readme } from "../../templates/misc/readme";
import { tsconfig, tsconfigBuild } from "../../templates/misc/tsconfig";
import { MiscGenerator } from "../misc.generator";

export function Misc(id: string) {
	const tsconfigFile = MiscGenerator(tsconfig, "tsconfig.json", id);
	const tsconfigBuildFile = MiscGenerator(tsconfigBuild, "tsconfig.build.json", id);
	const nestjsCliFile = MiscGenerator(nestjsCli, "nestjs-cli.json", id);
	const readmeFile = MiscGenerator(readme, "README.md", id);
	return [tsconfigFile, tsconfigBuildFile, nestjsCliFile, readmeFile];
}
