import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function ApiHealthCheck() {
	return applyDecorators(
		ApiOperation({
			summary: "Health check endpoint",
			description:
				"Performs a comprehensive health check of the application and its dependencies. " +
				"Verifies the status of external services (NestJS docs, NPM registry), memory usage (heap and RSS), " +
				"and disk storage availability. Returns detailed status information for each component."
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: "Health check completed successfully. All systems are operational.",
			schema: {
				type: "object",
				properties: {
					status: {
						type: "string",
						enum: ["ok", "error", "shutting_down"],
						description: "Overall health status of the application"
					},
					info: {
						type: "object",
						description: "Detailed information about healthy services",
						additionalProperties: {
							type: "object",
							properties: {
								status: { type: "string", example: "up" }
							}
						}
					},
					error: {
						type: "object",
						description: "Detailed information about unhealthy services",
						additionalProperties: {
							type: "object",
							properties: {
								status: { type: "string", example: "down" }
							}
						}
					},
					details: {
						type: "object",
						description: "Detailed status of all checked services and resources",
						additionalProperties: {
							type: "object",
							properties: {
								status: { type: "string" }
							}
						}
					},
					timestamp: {
						type: "string",
						format: "date-time",
						description: "ISO timestamp of when the health check was performed"
					}
				},
				example: {
					status: "ok",
					info: {
						"nestjs-docs": { status: "up" },
						"npm-registry": { status: "up" },
						memory_heap: { status: "up" },
						memory_rss: { status: "up" },
						storage: { status: "up" }
					},
					error: {},
					details: {
						"nestjs-docs": { status: "up" },
						"npm-registry": { status: "up" },
						memory_heap: { status: "up" },
						memory_rss: { status: "up" },
						storage: { status: "up" }
					},
					timestamp: "2025-10-25T00:00:00.000Z"
				}
			}
		}),
		ApiResponse({
			status: HttpStatus.SERVICE_UNAVAILABLE,
			description: "One or more health checks failed. The application may be experiencing issues.",
			schema: {
				type: "object",
				properties: {
					status: { type: "string", example: "error" },
					error: {
						type: "object",
						description: "Services that are unhealthy"
					},
					timestamp: { type: "string", format: "date-time" }
				}
			}
		})
	);
}

export function ApiLivenessCheck() {
	return applyDecorators(
		ApiOperation({
			summary: "Liveness probe endpoint",
			description:
				"Simple liveness check endpoint typically used by container orchestration systems " +
				"(like Kubernetes) to determine if the application is running. " +
				"Returns a basic status response without performing heavy health checks."
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: "Application is alive and responding to requests.",
			schema: {
				type: "object",
				properties: {
					status: {
						type: "string",
						example: "ok",
						description: "Application liveness status"
					},
					timestamp: {
						type: "string",
						format: "date-time",
						description: "ISO timestamp of the response"
					}
				},
				example: {
					status: "ok",
					timestamp: "2025-10-25T00:00:00.000Z"
				}
			}
		})
	);
}
