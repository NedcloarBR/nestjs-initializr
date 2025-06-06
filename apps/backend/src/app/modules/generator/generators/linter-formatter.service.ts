import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType:
import { MetadataDTO } from "../dtos/metadata.dto";
import { BiomeTemplate } from "../templates/linterFormatter/biome.template";
import { EslintPrettierTemplate } from "../templates/linterFormatter/eslint-prettier.template";
import { BaseGenerator } from "./base.generator";
// biome-ignore lint/style/useImportType:
import { PackageJsonService } from "./package-json.service";

@Injectable()
export class LinterFormatterService extends BaseGenerator {
	public constructor(private readonly packageJsonGenerator: PackageJsonService) {
		super();
	}

	public async generate(id: string, metadata: MetadataDTO["linterFormatter"]) {
		const linterFormatterFiles = [];

		if (metadata === "biome") {
			for (const template of BiomeTemplate.templates) {
				const file = this.createFile(id, template);
				linterFormatterFiles.push(file);
			}
			for (const packageMeta of BiomeTemplate.packages) {
				this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
			}
			for (const script of BiomeTemplate.scripts) {
				this.packageJsonGenerator.addScript(id, script.name, script.command);
			}
		}

		if (metadata === "eslint-prettier") {
			for (const template of EslintPrettierTemplate.templates) {
				const file = this.createFile(id, template);
				linterFormatterFiles.push(file);
			}
			for (const packageMeta of EslintPrettierTemplate.packages) {
				this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
			}
			for (const script of EslintPrettierTemplate.scripts) {
				this.packageJsonGenerator.addScript(id, script.name, script.command);
			}
		}

		return linterFormatterFiles;
	}
}
