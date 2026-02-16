/**
 * Linter/Formatter templates - Generates configuration for Biome or ESLint+Prettier
 */

export const biomeTemplate = {
	config: {
		name: "biome.json",
		path: "",
		content: `
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "root": true,
  "extends": ["@nedcloarbr/biome-config/nestjs", "@nedcloarbr/biome-config/ignore"]
}
`.trim()
	},
	scripts: [
		{ name: "format", command: "biome format --write ./" },
		{ name: "lint", command: "biome lint ./" },
		{ name: "check", command: "biome check --write ./" }
	]
};

export const eslintPrettierTemplate = {
	prettierrc: {
		name: ".prettierrc",
		path: "",
		content: `
{
  "singleQuote": true,
  "trailingComma": "all"
}
`.trim()
	},
	eslintConfig: {
		name: "eslint.config.mjs",
		path: "",
		content: `
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    },
  },
);
`.trim()
	},
	scripts: [
		{ name: "format", command: "prettier --write ." },
		{ name: "lint", command: "eslint ." }
	]
};
