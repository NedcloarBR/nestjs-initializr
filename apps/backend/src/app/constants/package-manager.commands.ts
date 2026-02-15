export type PackageManager = "npm" | "yarn" | "pnpm"

type CommandConfig = {
  install: {
    cmd: string
    args: string[]
  }
  start: {
    cmd: string
    args: string[]
  }
}

export const PACKAGE_MANAGER_COMMANDS: Record<
  PackageManager,
  CommandConfig
> = {
  npm: {
    install: {
      cmd: "npm",
      args: ["install"],
    },
    start: {
      cmd: "npm",
      args: ["run", "start"],
    },
  },

  yarn: {
    install: {
      cmd: "yarn",
      args: ["install"],
    },
    start: {
      cmd: "yarn",
      args: ["start"],
    },
  },

  pnpm: {
    install: {
      cmd: "pnpm",
      args: ["install"],
    },
    start: {
      cmd: "pnpm",
      args: ["start"],
    },
  },
}
