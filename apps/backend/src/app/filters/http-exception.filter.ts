import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { NodeEnv } from "@/types";
// biome-ignore lint/style/useImportType: Cannot use import type in classes used in dependency injection
import { ConfigService } from "../modules/config";

interface ErrorResponse {
	statusCode: number;
	timestamp: string;
	path: string;
	method: string;
	message: string | string[];
	error?: string;
	requestId?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	public constructor(private readonly configService: ConfigService) {}

	public catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();
		const request = ctx.getRequest<FastifyRequest>();

		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		const errorResponse: ErrorResponse = {
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			method: request.method,
			message: this.getErrorMessage(exception),
			requestId: request.requestId
		};

		if (this.configService.get("NODE_ENV") !== NodeEnv.production && exception instanceof Error) {
			errorResponse.error = exception.name;
		}

		this.logError(exception, request, status);

		void response.status(status).send(errorResponse);
	}

	private getErrorMessage(exception: unknown): string | string[] {
		if (exception instanceof HttpException) {
			const response = exception.getResponse();
			if (typeof response === "object" && "message" in response) {
				return response.message as string | string[];
			}
			return exception.message;
		}

		if (exception instanceof Error) {
			return this.configService.get("NODE_ENV") !== NodeEnv.production ? "Internal server error" : exception.message;
		}

		return "An unexpected error occurred";
	}

	private logError(exception: unknown, request: FastifyRequest, status: number) {
		const message = exception instanceof Error ? exception.message : "Unknown error";
		const stack = exception instanceof Error ? exception.stack : undefined;

		const logContext = {
			requestId: request.requestId,
			method: request.method,
			url: request.url,
			statusCode: status,
			userAgent: request.headers["user-agent"],
			ip: request.ip
		};

		if (status >= 500) {
			this.logger.error(message, stack, JSON.stringify(logContext));
		} else {
			this.logger.warn(message, JSON.stringify(logContext));
		}
	}
}
