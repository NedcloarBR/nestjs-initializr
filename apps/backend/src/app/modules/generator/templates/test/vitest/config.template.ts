export const VitestConfigTemplate = {
	name: "vitest.config.ts",
	path: "",
	content: `
    import { defineConfig } from 'vitest/config';
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
  `
};
