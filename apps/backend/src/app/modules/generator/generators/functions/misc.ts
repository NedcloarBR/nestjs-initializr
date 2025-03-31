import { nestjsCli } from "../../templates/misc/nestjs-cli";
import { readme } from "../../templates/misc/readme";
import { tsconfig, tsconfigBuild } from "../../templates/misc/tsconfig";
import { MiscGenerator } from "../misc.generator";

export function Misc(id: string) {
	MiscGenerator(tsconfig, "tsconfig.json", id);
	MiscGenerator(tsconfigBuild, "tsconfig.build.json", id);
	MiscGenerator(nestjsCli, "nestjs-cli.json", id);
	MiscGenerator(readme, "README.md", id);
}
