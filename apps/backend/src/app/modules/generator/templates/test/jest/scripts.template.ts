export const jestScripts = [
	{
		name: "test",
		command: "jest --runInBand --env-file=.env.test"
	},
	{
		name: "test:watch",
		command: "jest --watch --runInBand  --env-file=.env.test"
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
