import { nestjsCli } from "../../templates/misc/nestjs-cli";
import { readme } from "../../templates/misc/readme";
import { tsconfig, tsconfigBuild } from "../../templates/misc/tsconfig";
import { BaseGenerator } from "../base.generator";

export function Misc(id: string) {
	const tsconfigFile = BaseGenerator(tsconfig, "tsconfig.json", id);
	const tsconfigBuildFile = BaseGenerator(tsconfigBuild, "tsconfig.build.json", id);
	const nestjsCliFile = BaseGenerator(nestjsCli, "nestjs-cli.json", id);
	const readmeFile = BaseGenerator(readme, "README.md", id);
	return [tsconfigFile, tsconfigBuildFile, nestjsCliFile, readmeFile];
}
