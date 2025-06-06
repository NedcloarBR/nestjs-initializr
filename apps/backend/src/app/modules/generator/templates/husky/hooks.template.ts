import type { MetadataDTO } from "../../dtos/metadata.dto";
import type { Template } from "../../generators";

export function HuskyHooksTemplates(packageManager: MetadataDTO["packageManager"]): Template[] {
	return [
		{
			name: "pre-commit",
			path: ".husky/pre-commit",
			content: `${packageManager} lint-staged`
		},
		{
			name: "commit-msg",
			path: ".husky/commit-msg",
			content: `${packageManager} commitlint --config .commitlintrc.json --edit $HUSKY_GIT_PARAMS`
		}
	];
}
