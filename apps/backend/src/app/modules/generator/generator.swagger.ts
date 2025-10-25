import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function ApiGenerateProject() {
	return applyDecorators(
		ApiOperation({
			summary: "Generate NestJS project",
			description:
				"Generates a complete NestJS project based on the provided metadata configuration. " +
				"Returns a ZIP file containing the generated project structure with all selected modules, " +
				"dependencies, and configurations ready to use."
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: "Project successfully generated and returned as a ZIP file ready for download.",
			content: {
				"application/zip": {
					schema: {
						type: "string",
						format: "binary",
						description: "ZIP file containing the complete NestJS project structure"
					}
				}
			}
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: "Invalid metadata provided. Check the request body for validation errors."
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: "An error occurred while generating the project."
		})
	);
}

export function ApiGenerateConfig() {
	return applyDecorators(
		ApiOperation({
			summary: "Generate configuration file",
			description:
				"Generates a JSON configuration file based on the provided metadata. " +
				"This configuration file can be saved and reused later to regenerate the same project " +
				"structure without having to reconfigure all options manually. Perfect for sharing " +
				"project templates or maintaining consistent configurations across teams."
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: "Configuration file successfully generated and returned as a JSON file ready for download.",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							mainType: {
								type: "string",
								enum: ["fastify", "express"],
								description: "The HTTP adapter type for the NestJS application"
							},
							packageJson: {
								type: "object",
								properties: {
									name: { type: "string", description: "Project name in npm format" },
									description: { type: "string", description: "Brief description of the project" },
									nodeVersion: { type: "string", description: "Node.js version required for the project" }
								}
							},
							packageManager: {
								type: "string",
								enum: ["npm", "yarn", "pnpm", "bun"],
								description: "Package manager to use for the project"
							},
							modules: {
								type: "array",
								items: { type: "string" },
								description: "List of selected NestJS modules to include in the project"
							},
							extraPackages: {
								type: "array",
								items: {
									type: "object",
									properties: {
										name: { type: "string" },
										version: { type: "string" },
										dev: { type: "boolean" }
									}
								},
								description: "Additional npm packages to include in the project"
							}
						},
						example: {
							mainType: "fastify",
							packageJson: {
								name: "@organization/project-name",
								description: "A NestJS project generated with NestJS Initializr",
								nodeVersion: "20"
							},
							packageManager: "pnpm",
							modules: ["config", "swagger", "docker"],
							extraPackages: [
								{ name: "lodash", version: "^4.17.21", dev: false },
								{ name: "@types/lodash", version: "^4.14.195", dev: true }
							]
						}
					}
				}
			}
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: "Invalid metadata provided. Check the request body for validation errors."
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: "An error occurred while generating the configuration file."
		})
	);
}
