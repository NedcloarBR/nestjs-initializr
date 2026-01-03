/**
 * Husky templates - Generates Git hooks configuration with lint-staged and commitlint
 */

export function huskyHooksTemplates(packageManager: "npm" | "yarn" | "pnpm") {
	const runner = packageManager === "npm" ? "npx" : packageManager;

	return {
		preCommit: {
			name: "pre-commit",
			path: ".husky",
			content: `${runner} lint-staged`
		},
		commitMsg: {
			name: "commit-msg",
			path: ".husky",
			content: `${runner} commitlint --config .commitlintrc.json --edit $HUSKY_GIT_PARAMS`
		}
	};
}

export function huskyConfigTemplates(linterFormatter: "biome" | "eslint-prettier" | undefined) {
	return {
		commitlint: {
			name: ".commitlintrc.json",
			path: "",
			content: `
{
  "extends": ["@commitlint/config-angular"],
  "rules": {
    "subject-case": [2, "always", ["sentence-case", "start-case", "pascal-case", "upper-case", "lower-case"]],
    "type-enum": [
      2,
      "always",
      ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test", "types"]
    ]
  }
}
`.trim()
		},
		lintStaged: {
			name: ".lintstagedrc",
			path: "",
			content:
				linterFormatter === "biome"
					? `
{
  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
    "biome check --files-ignore-unknown=true",
    "biome check --write --no-errors-on-unmatched",
    "biome check --write --organize-imports-enabled=false --no-errors-on-unmatched",
    "biome check --write --unsafe --no-errors-on-unmatched",
    "biome format --write --no-errors-on-unmatched",
    "biome lint --write --no-errors-on-unmatched"
  ],
  "*": ["biome check --no-errors-on-unmatched --files-ignore-unknown=true"]
}
`.trim()
					: `
{
  "*.{js,ts,jsx,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
`.trim()
		}
	};
}
