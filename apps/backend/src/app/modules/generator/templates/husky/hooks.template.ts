import type { Template } from "@/types";
import type { MetadataDTO } from "../../dtos/metadata.dto";

export function HuskyHooksTemplates(packageManager: MetadataDTO["packageManager"]): Template[] {
	return [
		{
			name: "pre-commit",
			path: ".husky",
			content: `${packageManager} lint-staged`
		},
		{
			name: "commit-msg",
			path: ".husky",
			content: `${packageManager} commitlint --config .commitlintrc.json --edit $HUSKY_GIT_PARAMS`
		}
	];
}
