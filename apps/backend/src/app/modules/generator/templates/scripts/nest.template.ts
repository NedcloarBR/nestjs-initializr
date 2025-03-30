export const nestScripts = {
	build: {
		name: "build",
		command: "nest build"
	},
	start: {
		name: "start",
		command: "nest start"
	},
	"start:dev": {
		name: "start:dev",
		command: "nest start --watch"
	},
	"start:debug": {
		name: "start:debug",
		command: "nest start --debug --watch"
	},
	"start:prod": {
		name: "start:prod",
		command: "node dist/main"
	}
};
