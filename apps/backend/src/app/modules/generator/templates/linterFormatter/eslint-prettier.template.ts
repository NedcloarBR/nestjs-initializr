import { DEV_NPM_DEPENDENCIES } from "@/app/constants/packages";

export const EslintPrettierTemplate = {
	packages: [
		{
			name: DEV_NPM_DEPENDENCIES["@eslint/eslintrc"].name,
			version: DEV_NPM_DEPENDENCIES["@eslint/eslintrc"].version,
			dev: true
		},
		{
			name: DEV_NPM_DEPENDENCIES["@eslint/js"].name,
			version: DEV_NPM_DEPENDENCIES["@eslint/js"].version,
			dev: true
		},
		{
			name: DEV_NPM_DEPENDENCIES["eslint"].name,
			version: DEV_NPM_DEPENDENCIES["eslint"].version,
			dev: true
		},
		{
			name: DEV_NPM_DEPENDENCIES["eslint-config-prettier"].name,
			version: DEV_NPM_DEPENDENCIES["eslint-config-prettier"].version,
			dev: true
		},
		{
			name: DEV_NPM_DEPENDENCIES["eslint-plugin-prettier"].name,
			version: DEV_NPM_DEPENDENCIES["eslint-plugin-prettier"].version,
			dev: true
		},
		{
			name: DEV_NPM_DEPENDENCIES["prettier"].name,
			version: DEV_NPM_DEPENDENCIES["prettier"].version,
			dev: true
		},
		{
			name: DEV_NPM_DEPENDENCIES["typescript-eslint"].name,
			version: DEV_NPM_DEPENDENCIES["typescript-eslint"].version,
			dev: true
		}
	],
	templates: [
		{
			name: ".prettierrc",
			path: "",
			content: `
        {
          "singleQuote": true,
          "trailingComma": "all"
        }
      `
		},
		{
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
      `
		}
	],
	scripts: [
		{
			name: "format",
			command: "prettier --write ."
		},
		{
			name: "lint",
			command: "eslint ."
		}
	]
};
