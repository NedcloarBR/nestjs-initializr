import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { GatewayMetadata } from "@nestjs/websockets";
import { instrument } from "@socket.io/admin-ui";
import type { Server } from "socket.io";
import { Services } from "@/app/constants/services";
// biome-ignore lint/style/useImportType: Cannot use 'import type' in Dependency Injection
import { ConfigService } from "@/app/modules/config";

export class SocketInstrumentAdapter extends IoAdapter {
	private readonly configService: ConfigService;

	public constructor(app: NestFastifyApplication) {
		super(app);
		this.configService = app.get<ConfigService>(Services.Config);
	}

	public createIOServer(port: number, options?: GatewayMetadata): Server {
		const server = super.createIOServer(port, {
			...options,
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
				credentials: false
			}
		} as GatewayMetadata);

		const enabled = this.configService.get("SOCKET_ADMIN_ENABLED");
		if (!enabled) {
			return server;
		}

		instrument(server, {
			auth: {
				type: "basic",
				username: this.configService.get("SOCKET_ADMIN_USERNAME"),
				password: this.configService.get("SOCKET_ADMIN_PASSWORD")
			}
		});

		return server;
	}
}
