import { Injectable } from "@nestjs/common";
import { DEV_NPM_DEPENDENCIES } from "../../../constants/packages";
import type { MetadataDTO } from "../dtos/metadata.dto";
import { JestConfigTemplate } from "../templates/test/jest/config.template";
import { jestScripts } from "../templates/test/jest/scripts.template";
import { VitestConfigTemplate } from "../templates/test/vitest/config.template";
import { vitestScripts } from "../templates/test/vitest/scripts.template";
import { BaseGenerator } from "./base.generator";
// biome-ignore lint/style/useImportType: <>
import { PackageJsonService } from "./package-json.service";

@Injectable()
export class TestRunnerService extends BaseGenerator {
	public constructor(private readonly packageJsonGenerator: PackageJsonService) {
		super();
	}

	public async generate(id: string, testRunner: MetadataDTO["testRunner"]) {
		const files = [];

		const commonPackages = [
			{
				...DEV_NPM_DEPENDENCIES["@nestjs/testing"],
				dev: true
			},
			{
				...DEV_NPM_DEPENDENCIES["supertest"],
				dev: true
			},
			{
				...DEV_NPM_DEPENDENCIES["@types/supertest"],
				dev: true
			}
		];
		for (const pkg of commonPackages) {
			await this.packageJsonGenerator.addPackage(id, pkg.name, pkg.version, pkg.dev);
		}

		if (testRunner === "jest") {
			const jestPackages = [
				{
					...DEV_NPM_DEPENDENCIES["jest"],
					dev: true
				},
				{
					...DEV_NPM_DEPENDENCIES["@types/jest"],
					dev: true
				},
				{
					...DEV_NPM_DEPENDENCIES["ts-jest"],
					dev: true
				}
			];

			const jestConfigFile = this.createFile(id, JestConfigTemplate);
			for (const pkg of jestPackages) {
				await this.packageJsonGenerator.addPackage(id, pkg.name, pkg.version, pkg.dev);
			}
			for (const script of jestScripts) {
				await this.packageJsonGenerator.addScript(id, script.name, script.command);
			}
			files.push(jestConfigFile);
		}

		if (testRunner === "vitest") {
			const vitestPackages = [
				{
					...DEV_NPM_DEPENDENCIES["vitest"],
					dev: true
				},
				{
					...DEV_NPM_DEPENDENCIES["vite-tsconfig-paths"],
					dev: true
				},
				{
					...DEV_NPM_DEPENDENCIES["@vitest/ui"],
					dev: true
				},
				{
					...DEV_NPM_DEPENDENCIES["@vitest/coverage-v8"],
					dev: true
				}
			];

			const vitestConfigFile = this.createFile(id, VitestConfigTemplate);
			for (const pkg of vitestPackages) {
				await this.packageJsonGenerator.addPackage(id, pkg.name, pkg.version, pkg.dev);
			}
			for (const script of vitestScripts) {
				await this.packageJsonGenerator.addScript(id, script.name, script.command);
			}
			files.push(vitestConfigFile);
		}

		return files;
	}
}
