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
