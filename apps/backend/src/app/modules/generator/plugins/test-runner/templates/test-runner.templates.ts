export const JestConfigTemplate = `import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import type { Config } from 'jest';

const scope = process.env.TEST_SCOPE ?? 'unit';

const testRegexMap: Record<string, string> = {
  unit: '.*\\\\.spec\\\\.ts$',
  integration: '.*\\\\.int-spec\\\\.ts$',
  e2e: '.*\\\\.e2e-spec\\\\.ts$',
};

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testRegex: testRegexMap[scope],
  transform: {
    '^.+\\\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node'
};

export default config;
`;

export const VitestConfigTemplate = `import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const scope = process.env.TEST_SCOPE ?? 'unit';

const testFilePatterns: Record<string, string[]> = {
  unit: ['**/*.spec.ts'],
  integration: ['**/*.int-spec.ts'],
  e2e: ['**/*.e2e-spec.ts'],
};

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: testFilePatterns[scope],
    environment: 'node',
    globals: true,
    ui: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: \`coverage/\${scope}\`,
      reporter: ['text', 'html'],
    },
  },
});
`;

export const jestScripts = [
	{
		name: "test",
		command: "jest --runInBand --env-file=.env.test"
	},
	{
		name: "test:watch",
		command: "jest --watch --runInBand --env-file=.env.test"
	},
	{
		name: "test:coverage",
		command: "jest --coverage --runInBand --env-file=.env.test"
	},
	{
		name: "test:debug",
		command: "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
	},
	{
		name: "test:e2e",
		command: "TEST_SCOPE=e2e jest --runInBand --env-file=.env.test"
	},
	{
		name: "test:int",
		command: "TEST_SCOPE=integration jest --config=jest.int.config.js --runInBand --env-file=.env.test"
	}
];

export const vitestScripts = [
	{
		name: "test",
		command: "vitest run"
	},
	{
		name: "test:int",
		command: "TEST_SCOPE=integration vitest run"
	},
	{
		name: "test:e2e",
		command: "TEST_SCOPE=e2e vitest run"
	},
	{
		name: "test:watch",
		command: "vitest watch"
	},
	{
		name: "test:ui",
		command: "vitest --ui"
	}
];
