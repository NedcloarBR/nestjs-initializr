import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import type { Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest<FastifyRequest>();
		const reply = context.switchToHttp().getResponse();

		let requestId = request.headers["x-request-id"] as string;

		if (!requestId) {
			requestId = uuidv4();
			reply.header("x-request-id", requestId);
		}

		request.requestId = requestId;

		return next.handle();
	}
}
