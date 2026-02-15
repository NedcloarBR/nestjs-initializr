import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Controller, Get, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";

@Controller("socket-admin-ui")
export class SocketAdminUIController {
	@Get()
	public index(@Res() reply: FastifyReply) {
		const html = readFileSync(
			join(process.cwd(), "node_modules/@socket.io/admin-ui/ui/dist/index.html"),
			"utf-8"
		).replace("<head>", `<head><base href="/api/socket-admin-ui/">`);

		return reply.type("text/html").send(html);
	}
}
