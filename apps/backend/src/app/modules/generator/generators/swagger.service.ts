import fs from "node:fs";
import { Injectable } from "@nestjs/common";
import { NPM_DEPENDENCIES } from "../../../constants/packages";
import { SwaggerTemplateReplaceKeys, SwaggerTemplates } from "../templates/swagger.templates";
import { BaseGenerator } from "./base.generator";
// biome-ignore lint/style/useImportType: <>
import { FileUpdaterService } from "./file-updater.service";
// biome-ignore lint/style/useImportType: <>
import { PackageJsonService } from "./package-json.service";

@Injectable()
export class SwaggerService extends BaseGenerator {
	public constructor(
		private readonly packageJsonGenerator: PackageJsonService,
		private readonly fileUpdaterGenerator: FileUpdaterService
	) {
		super();
	}

	public async generate(
		id: string,
		mainType: "fastify" | "express",
		withConfigModule: boolean,
		withI18nModule: boolean,
		withScalarApiReference: boolean,
		projectName: string
	): Promise<void> {
		const swagger = SwaggerTemplates(mainType, withConfigModule, withI18nModule, withScalarApiReference);

		let libIndex = fs.existsSync(this.getPath(id, "src/lib/index.ts"))
			? this.getPath(id, "src/lib/index.ts")
			: undefined;
		if (!libIndex) {
			this.createFile(id, swagger.lib);
			libIndex = this.getPath(id, "src/lib/index.ts");
		}
		let _libContent = this.readFile(libIndex);
		_libContent += `\n${swagger.lib.content}`;
		this.packageJsonGenerator.addPackage(
			id,
			NPM_DEPENDENCIES["@nestjs/swagger"].name,
			NPM_DEPENDENCIES["@nestjs/swagger"].version
		);
		if (mainType === "fastify")
			this.packageJsonGenerator.addPackage(
				id,
				NPM_DEPENDENCIES["@fastify/static"].name,
				NPM_DEPENDENCIES["@fastify/static"].version
			);
		if (withScalarApiReference)
			this.packageJsonGenerator.addPackage(
				id,
				NPM_DEPENDENCIES["@scalar/nestjs-api-reference"].name,
				NPM_DEPENDENCIES["@scalar/nestjs-api-reference"].version
			);
		this.createFile(id, {
			name: swagger.templates[0].name,
			path: swagger.templates[0].path,
			content: swagger.templates[0].content.replace(SwaggerTemplateReplaceKeys.PROJECT_NAME, projectName)
		});
		for (const template of swagger.main) {
			await this.fileUpdaterGenerator.update(id, "src", "main.ts", template);
		}
	}
}
