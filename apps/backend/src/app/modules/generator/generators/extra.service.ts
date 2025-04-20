import { Injectable } from "@nestjs/common";
import { NPM_DEPENDENCIES } from "../../../constants/packages";
// biome-ignore lint/style/useImportType:
import { MetadataDTO } from "../dtos/metadata.dto";
import { cors } from "../templates/extra/cors";
import { helmet } from "../templates/extra/helmet";
import { validation } from "../templates/extra/validation";
import { BaseGenerator } from "./base.generator";
// biome-ignore lint/style/useImportType:
import { MainUpdaterService } from "./main-updater.service";
// biome-ignore lint/style/useImportType:
import { PackageJsonService } from "./package-json.service";

@Injectable()
export class ExtraService extends BaseGenerator {
	public constructor(
		private readonly packageJsonGenerator: PackageJsonService,
		private readonly mainUpdaterGenerator: MainUpdaterService
	) {
		super();
	}

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
	public async generate(
		id: string,
		extras: MetadataDTO["extras"],
		mainType: "fastify" | "express",
		withConfigModule: boolean
	) {
		for (const extra of extras) {
			if (extra === "cors") {
				await this.mainUpdaterGenerator.update(id, cors(withConfigModule));
			}

			if (extra === "helmet") {
				for (const helmetTemplate of helmet(mainType, withConfigModule)) {
					await this.mainUpdaterGenerator.update(id, helmetTemplate);
				}
				mainType === "fastify"
					? await this.packageJsonGenerator.addPackage(
							id,
							NPM_DEPENDENCIES["@fastify/helmet"].name,
							NPM_DEPENDENCIES["@fastify/helmet"].version
						)
					: await this.packageJsonGenerator.addPackage(
							id,
							NPM_DEPENDENCIES["helmet"].name,
							NPM_DEPENDENCIES["helmet"].version
						);
			}

			if (extra === "validation") {
				for (const validationTemplate of validation(withConfigModule)) {
					await this.mainUpdaterGenerator.update(id, validationTemplate);
				}
				await this.packageJsonGenerator.addPackage(
					id,
					NPM_DEPENDENCIES["class-validator"].name,
					NPM_DEPENDENCIES["class-validator"].version
				);
				await this.packageJsonGenerator.addPackage(
					id,
					NPM_DEPENDENCIES["class-transformer"].name,
					NPM_DEPENDENCIES["class-transformer"].version
				);
			}
		}
	}
}
