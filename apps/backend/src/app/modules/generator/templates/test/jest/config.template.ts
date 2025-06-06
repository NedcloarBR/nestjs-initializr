export const JestConfigTemplate = {
	name: "jest.config.ts",
	path: "",
	content: `
    import { pathsToModuleNameMapper } from 'ts-jest';
    import { compilerOptions } from './tsconfig.json';
    import type { Config } from 'jest';

    const scope = process.env.TEST_SCOPE ?? 'unit';

    const testRegexMap: Record<string, string> = {
      unit: '.*\\.spec\\.ts$',
      integration: '.*\\.int-spec\\.ts$',
      e2e: '.*\\.e2e-spec\\.ts$',
    };

    const config: Config = {
      moduleFileExtensions: ['js', 'json', 'ts'],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
      }),
      testRegex: testRegexMap[scope],
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      collectCoverageFrom: ['**/*.(t|j)s'],
      coverageDirectory: '../coverage',
      testEnvironment: 'node'
    };

    export default config;
  `
};
