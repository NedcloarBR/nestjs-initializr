import { Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { Services } from "@/app/constants/services";
// biome-ignore lint/style/useImportType: Cannot use 'import type' in Dependency Injection
import { ConfigService } from "@/app/modules/config";

@Injectable()
export class AdminUiEnabledMiddleware implements NestMiddleware {
	public constructor(@Inject(Services.Config) private readonly configService: ConfigService) {}

	public use(_req: Request, res: Response, next: NextFunction): void {
		if (!this.configService.get("SOCKET_ADMIN_ENABLED")) {
			res.status(404).end();
			return;
		}

		next();
	}
}
