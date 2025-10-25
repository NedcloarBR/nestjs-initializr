import { Logger } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

export function NodeHandler(app: NestFastifyApplication) {
	process.on("SIGTERM", async () => {
		Logger.log("SIGTERM received, closing application gracefully", "NodeHandler");
		await app.close();
		process.exit(0);
	});

	process.on("SIGINT", async () => {
		Logger.log("SIGINT received, closing application gracefully", "NodeHandler");
		await app.close();
		process.exit(0);
	});
}
