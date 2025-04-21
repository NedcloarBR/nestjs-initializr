import fs from "node:fs";
import { Injectable } from "@nestjs/common";
import { NPM_DEPENDENCIES } from "../../../constants/packages";
import { swaggerLibIndex, swaggerLibTemplate, swaggerMainTemplate } from "../templates/swagger";
import { BaseGenerator } from "./base.generator";
// biome-ignore lint/style/useImportType: <explanation>
import { MainUpdaterService } from "./main-updater.service";
import { PackageJsonService } from "./package-json.service";

@Injectable()
export class SwaggerService extends BaseGenerator {
	public constructor(
		private readonly packageJsonGenerator: PackageJsonService,
		private readonly mainUpdaterGenerator: MainUpdaterService
	) {
		super();
	}

	public async generate(id: string, mainType: "fastify" | "express", withConfigModule: boolean): Promise<void> {
		let libIndex = fs.existsSync(this.getPath(id, "src/lib/index.ts"))
			? this.getPath(id, "src/lib/index.ts")
			: undefined;
		if (!libIndex) {
			this.createFile(id, swaggerLibIndex);
			libIndex = this.getPath(id, "src/lib/index.ts");
		}
		let libContent = this.readFile(libIndex);
		libContent += `\n${swaggerLibIndex.content}`;
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
		this.createFile(id, swaggerLibTemplate(mainType));
		for (const template of swaggerMainTemplate(withConfigModule)) {
			await this.mainUpdaterGenerator.update(id, template);
		}
	}
}
