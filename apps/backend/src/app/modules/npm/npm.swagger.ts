import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

export function ApiGetPackages() {
	return applyDecorators(
		ApiOperation({
			summary: "Search NPM packages",
			description:
				"Searches for NPM packages by name using the NPM registry API. " +
				"Returns a list of matching packages with their metadata including name, version, description, and popularity metrics. " +
				"Useful for discovering and adding extra packages to your NestJS project."
		}),
		ApiQuery({
			name: "name",
			required: false,
			type: String,
			description: "Package name or search term to query in the NPM registry",
			example: "nestjs"
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: "List of packages matching the search criteria successfully retrieved.",
			schema: {
				type: "object",
				properties: {
					objects: {
						type: "array",
						description: "Array of package objects matching the search query",
						items: {
							type: "object",
							properties: {
								package: {
									type: "object",
									properties: {
										name: {
											type: "string",
											description: "Package name as registered in NPM",
											example: "@nestjs/core"
										},
										version: {
											type: "string",
											description: "Latest version of the package",
											example: "10.3.0"
										},
										description: {
											type: "string",
											description: "Brief description of the package",
											example: "Nest - modern, fast, powerful node.js web framework"
										},
										keywords: {
											type: "array",
											items: { type: "string" },
											description: "Keywords associated with the package"
										},
										date: {
											type: "string",
											format: "date-time",
											description: "Last publication date"
										},
										links: {
											type: "object",
											properties: {
												npm: { type: "string", description: "NPM package page URL" },
												homepage: { type: "string", description: "Package homepage URL" },
												repository: { type: "string", description: "Repository URL" }
											}
										},
										publisher: {
											type: "object",
											properties: {
												username: { type: "string" },
												email: { type: "string" }
											}
										},
										maintainers: {
											type: "array",
											items: {
												type: "object",
												properties: {
													username: { type: "string" },
													email: { type: "string" }
												}
											}
										}
									}
								},
								score: {
									type: "object",
									description: "Quality and popularity metrics",
									properties: {
										final: {
											type: "number",
											description: "Final calculated score (0-1)",
											example: 0.9
										},
										detail: {
											type: "object",
											properties: {
												quality: { type: "number", description: "Quality score" },
												popularity: { type: "number", description: "Popularity score" },
												maintenance: { type: "number", description: "Maintenance score" }
											}
										}
									}
								},
								searchScore: {
									type: "number",
									description: "Relevance score for the search query",
									example: 100000.31
								}
							}
						}
					},
					total: {
						type: "number",
						description: "Total number of packages found",
						example: 10
					},
					time: {
						type: "string",
						format: "date-time",
						description: "Timestamp of the search"
					}
				},
				example: {
					objects: [
						{
							package: {
								name: "@nestjs/core",
								version: "10.3.0",
								description: "Nest - modern, fast, powerful node.js web framework",
								keywords: ["framework", "web", "nestjs", "typescript"],
								date: "2024-01-15T10:30:00.000Z",
								links: {
									npm: "https://www.npmjs.com/package/%40nestjs%2Fcore",
									homepage: "https://nestjs.com",
									repository: "https://github.com/nestjs/nest"
								}
							},
							score: {
								final: 0.95,
								detail: {
									quality: 0.96,
									popularity: 0.94,
									maintenance: 0.95
								}
							},
							searchScore: 100000.31
						}
					],
					total: 1,
					time: "2025-10-25T00:00:00.000Z"
				}
			}
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: "Invalid search query provided."
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: "An error occurred while searching the NPM registry."
		})
	);
}
