import { join } from "node:path";
import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AdminUiEnabledMiddleware } from "@/app/common/middlewares/admin-ui-auth.middleware";
import { SocketAdminUIController } from "./socket-admin-ui.controller";

@Module({
	imports: [
		ServeStaticModule.forRoot({
			serveRoot: "/socket-admin-ui",
			renderPath: "/socket-admin-ui",
			useGlobalPrefix: true,
			rootPath: join(process.cwd(), "node_modules/@socket.io/admin-ui/ui/dist")
		})
	],
	controllers: [SocketAdminUIController]
})
export class StaticModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer.apply(AdminUiEnabledMiddleware).forRoutes("/socket-admin-ui");
	}
}
