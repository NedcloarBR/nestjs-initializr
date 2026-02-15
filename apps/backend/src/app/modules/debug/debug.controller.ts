import { Body, Controller, Post, Req } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
// biome-ignore lint/style/useImportType: Cannot use 'import type' in Dependency Injection
import { MetadataDTO } from "../generator/dtos/metadata.dto";
// biome-ignore lint/style/useImportType: Cannot use 'import type' in Dependency Injection
import { DebugService } from "./debug.service";

@Controller("debugger")
export class DebugController {
	constructor(private readonly debugService: DebugService) {}

	@Post("session")
	public createSession() {
		const sessionId = Math.random().toString(36).slice(2);
		return { sessionId };
	}

	@Post("start")
	public startDebug(@Req() req: FastifyRequest, @Body() metadata: MetadataDTO) {
		const sessionId = req.headers["x-debug-session-id"] as string;

		this.debugService.debugAndStreamProject(metadata, req.requestId, sessionId);

		return { started: true };
	}
}
