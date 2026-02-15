import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Injectable } from "@nestjs/common";
import { PACKAGE_MANAGER_COMMANDS, type PackageManager } from "@/app/constants/package-manager.commands";
import type { MetadataDTO } from "../generator/dtos/metadata.dto";
// biome-ignore lint/style/useImportType: Cannot use "import type" in Dependency Injection
import { PluginGeneratorService } from "../generator/plugin-generator.service";
// biome-ignore lint/style/useImportType: Cannot use "import type" in Dependency Injection
import { DebugGateway } from "./debug.gateway";

@Injectable()
export class DebugService {
	public constructor(
		private readonly generatorService: PluginGeneratorService,
		private readonly debugGateway: DebugGateway
	) {}

	private readonly runningSessions = new Set<string>();
	private readonly runningProcesses = new Map<string, Set<ChildProcessWithoutNullStreams>>();

	public async debugAndStreamProject(metadata: MetadataDTO, id: string, sessionId: string): Promise<void> {
    const startedAt = Date.now();
		if (this.runningSessions.has(sessionId)) {
			this.debugGateway.sendLog(sessionId, "[info] Session already running.");
			return;
		}

		this.killAllRunningProcesses();

		this.runningSessions.add(sessionId);
		this.debugGateway.sendLog(sessionId, "[info] Starting debug session...");

		try {
			const generatedPath = await this.generatorService.generate(metadata, id, true) as string;

			const pm = metadata.packageManager as PackageManager;
			const commands = PACKAGE_MANAGER_COMMANDS[pm];

			const nodeModulesPath = join(generatedPath, "node_modules");

			if (!existsSync(nodeModulesPath)) {
				this.debugGateway.sendLog(sessionId, "[info] Installing dependencies...");
				await this.runAndStream(commands.install, generatedPath, sessionId);
			} else {
				this.debugGateway.sendLog(sessionId, "[info] Dependencies already installed.");
			}
      this.debugGateway.sendLog(sessionId, `[debug] Total setup time: ${Date.now() - startedAt}ms`);
			this.startProject(commands.start, generatedPath, sessionId);
		} catch (error) {
			this.runningSessions.delete(sessionId);
			this.debugGateway.sendLog(sessionId, `[error] ${(error as Error).message}`);
		}
	}

	private startProject(command: { cmd: string; args: string[] }, cwd: string, sessionId: string): void {
		const spawnStartedAt = Date.now();

		const proc = spawn(command.cmd, command.args, {
			cwd,
			stdio: ["ignore", "pipe", "pipe"],
      detached: true,
			env: this.getEnv()
		});

    proc.on("error", (err) => {
      this.debugGateway.sendLog(sessionId, `[fatal] Error while debugging: ${err.message}`);
      this.runningSessions.delete(sessionId);
    });

		this.debugGateway.sendLog(sessionId, `[debug] spawn returned in ${Date.now() - spawnStartedAt}ms`);

		this.registerProcess(sessionId, proc);
		this.streamProcess(proc, sessionId);

		const timeout = setTimeout(() => {
			this.debugGateway.sendLog(sessionId, "[info] Maximum debug time reached. Terminating process.");
			if (!proc.killed) {
        process.kill(-proc.pid!, "SIGKILL")
      }
		}, 20_000);

		proc.on("close", (code, signal) => {
			clearTimeout(timeout);
			this.runningSessions.delete(sessionId);
			this.debugGateway.sendLog(sessionId, `[info] Debug session finished. Process exited with ${signal ? `signal ${signal}` : `code ${code}`}`);
		});
	}

	private runAndStream(command: { cmd: string; args: string[] }, cwd: string, sessionId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const proc = spawn(command.cmd, command.args, {
				cwd,
				stdio: ["ignore", "pipe", "pipe"],
				env: this.getEnv()
			});

      proc.on("error", (err) => {
        this.debugGateway.sendLog(sessionId, `[fatal] Error while debugging: ${err.message}`);
        this.runningSessions.delete(sessionId);
      });

			this.registerProcess(sessionId, proc);
			this.streamProcess(proc, sessionId);

			proc.on("close", (code) => {
				code === 0 ? resolve() : reject(new Error(`Process finished with code ${code}`));
			});
		});
	}

	private streamProcess(
    proc: ChildProcessWithoutNullStreams,
    sessionId: string
  ): void {
    let stdoutBuffer = "";
    let stderrBuffer = "";

    const flushStdout = () => {
      if (stdoutBuffer.trim().length > 0) {
        this.debugGateway.sendLog(sessionId, stdoutBuffer);
        stdoutBuffer = "";
      }
    };

    const flushStderr = () => {
      if (stderrBuffer.trim().length > 0) {
        this.debugGateway.sendLog(sessionId, stderrBuffer);
        stderrBuffer = "";
      }
    };

    proc.stdout.on("data", (data) => {
      stdoutBuffer += data.toString();

      const lines = stdoutBuffer.split(/\r?\n|\r/);
      stdoutBuffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.length > 0) {
          this.debugGateway.sendLog(sessionId, line);
        }
      }
    });

    proc.stderr.on("data", (data) => {
      stderrBuffer += data.toString();

      const lines = stderrBuffer.split(/\r?\n|\r/);
      stderrBuffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.length > 0) {
          this.debugGateway.sendLog(sessionId, `${line}\n`);
        }
      }
    });

    proc.on("close", () => {
      flushStdout();
      flushStderr();
    });
  }

	private registerProcess(sessionId: string, proc: ChildProcessWithoutNullStreams): void {
		if (!this.runningProcesses.has(sessionId)) {
			this.runningProcesses.set(sessionId, new Set());
		}

		this.runningProcesses.get(sessionId)!.add(proc);

		proc.on("close", () => {
			this.runningProcesses.get(sessionId)?.delete(proc);
		});
	}

	private killAllRunningProcesses(): void {
    for (const [sessionId, processes] of this.runningProcesses.entries()) {
      for (const proc of processes) {
        if (!proc.pid) continue;

        this.debugGateway.sendLog(sessionId, "[info] Terminating active debug process.");

        try {
          process.kill(-proc.pid, "SIGKILL");
        } catch (error) {
          if (error.code !== "ESRCH") {
            this.debugGateway.sendLog(
              sessionId,
              `[error] Failed to kill process: ${error.message}`
            );
          }
        }
      }
    }

    this.runningProcesses.clear();
    this.runningSessions.clear();
  }

  private getEnv() {
    const env = { ...process.env };

    const variablesToRemove = [
      "PORT",
      "GLOBAL_PREFIX",
      "CORS_ORIGIN",
      "SOCKET_ADMIN_ENABLED",
      "SOCKET_ADMIN_USERNAME",
      "SOCKET_ADMIN_PASSWORD",
    ];

    for (const key of Object.keys(env)) {
      if (variablesToRemove.includes(key)) {
        delete env[key];
      }
    }

    return {
      ...env,
      FORCE_COLOR: "1",
      CI: "1",
    };
  }
}
