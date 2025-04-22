import { Injectable } from "@nestjs/common";
import type { MetadataDTO } from "../dtos/metadata.dto";
import { PackageJsonReplaceKeys, PackageJsonTemplate } from "../templates/package-json.template";
import { nestScripts } from "../templates/scripts.template";
import { BaseGenerator } from "./base.generator";

@Injectable()
export class PackageJsonService extends BaseGenerator {
	public async generate(metadata: MetadataDTO["packageJson"], id: string) {
		const content = PackageJsonTemplate.content
			.replace(PackageJsonReplaceKeys.PROJECT_NAME, metadata.name)
			.replace(PackageJsonReplaceKeys.PROJECT_DESCRIPTION, metadata.description)
			.replace(PackageJsonReplaceKeys.NODE_VERSION, metadata.nodeVersion);

		const file = this.createFile(id, {
			...PackageJsonTemplate,
			content
		});

		for (const script of Object.values(nestScripts)) {
			await this.addScript(id, script.name, script.command);
		}

		return file;
	}

	public async addPackage(id: string, name: string, version: string, dev?: boolean) {
		const file = this.getPath(id, "package.json");
		const packageJson = JSON.parse(this.readFile(file));
		if (packageJson.dependencies[name] || packageJson.devDependencies[name]) return;

		!dev
			? // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
				(packageJson.dependencies[name] = version)
			: // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
				(packageJson.devDependencies[name] = version);

		this.writeFile(file, JSON.stringify(packageJson, null, 2));
	}

	public async addScript(id: string, name: string, command: string) {
		const file = this.getPath(id, "package.json");
		const packageJson = JSON.parse(this.readFile(file));

		if (packageJson.scripts[name]) return;

		packageJson.scripts[name] = command;

		this.writeFile(file, JSON.stringify(packageJson, null, 2));
	}

	public async addProperty(id: string, name: string, value: string | Record<string, unknown>) {
		const file = this.getPath(id, "package.json");
		const packageJson = JSON.parse(this.readFile(file));

		if (packageJson[name]) return;

		packageJson[name] = value;

		this.writeFile(file, JSON.stringify(packageJson, null, 2));
	}
}
