import { Injectable } from "@nestjs/common";
import { NPM_DEPENDENCIES } from "../../../constants/packages";
// biome-ignore lint/style/useImportType:
import { MetadataDTO } from "../dtos/metadata.dto";
import { extrasMetadata } from "../templates/extra";
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

	public async generate(
		id: string,
		extras: MetadataDTO["extras"],
		mainType: "fastify" | "express",
		withConfigModule: boolean
	) {
		const metadata = extrasMetadata(mainType, withConfigModule);

		for (const extra of extras) {
			if (metadata[extra].templates)
				for (const template of metadata[extra].templates) {
					await this.mainUpdaterGenerator.update(id, template);
				}

			if (metadata[extra].packages) {
				for (const pkg of metadata[extra].packages) {
					await this.packageJsonGenerator.addPackage(id, pkg.name, pkg.version);
				}
			}
		}
	}
}
