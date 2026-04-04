// biome-ignore lint/style/noDefaultExport: <>
export default {
	displayName: "backend",
	preset: "../../jest.preset.js",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }]
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^@test/(.*)$": "<rootDir>/test/$1",
		"^uuid$": require.resolve("uuid")
	},
	transformIgnorePatterns: ["node_modules/(?!(uuid)/)"],
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory: "../../coverage/apps/backend"
};
