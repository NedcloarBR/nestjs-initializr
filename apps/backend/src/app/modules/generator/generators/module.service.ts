import fs from "node:fs";
import { Injectable } from "@nestjs/common";
import { BaseGenerator, type Template } from "./base.generator";

@Injectable()
export class ModuleService extends BaseGenerator {
	public async generate(
		id: string,
		templates: Template[],
		metadata: { import: string; export: string; importIn?: string },
		mainType: "fastify" | "express"
	) {
		const rootFiles = [];
		for (const rawTemplate of templates) {
			const template = typeof rawTemplate === "function" ? rawTemplate(mainType) : rawTemplate;
			const file = this.createFile(id, template);
			if (template.path === "") {
				rootFiles.push(file);
			}
		}
		this.updateExport(id, metadata.export);
		if (metadata.importIn) {
			this.updateImport(id, metadata.import, metadata.importIn);
		}

		return rootFiles;
	}

	public updateExport(id: string, exportString: string) {
		const allModulesIndexPath = this.getPath(id, "src/modules/index.ts");
		let allModulesIndexContent = this.readFile(allModulesIndexPath);
		allModulesIndexContent += exportString;
		this.writeFile(allModulesIndexPath, allModulesIndexContent);
	}

	public updateImport(id: string, importString: string, moduleToUpdatePath: string) {
		const moduleToUpdatePathResolved = this.getPath(id, moduleToUpdatePath);
		const moduleToUpdateContent = this.readFile(moduleToUpdatePathResolved);

		this.writeFile(moduleToUpdatePathResolved, moduleToUpdateContent);
	}

	public updateServiceConstants(id: string, serviceConstant: string) {
		let constantFile = fs.existsSync(this.getPath(id, "src/constants/services.ts"))
			? this.getPath(id, "src/constants/services.ts")
			: undefined;
		if (!constantFile) {
			this.createFile(id, {
				name: "services.ts",
				path: "src/constants",
				content: "export enum Services {\n}\n"
			});
			constantFile = this.getPath(id, "src/constants/services.ts");
		}
		const constantContent = this.readFile(constantFile);

		const constantRegex = /export enum Services {\n}/g;
		const newConstantContent = constantContent.replace(
			constantRegex,
			`export enum Services {\n\t${serviceConstant},\n}`
		);
		this.writeFile(constantFile, newConstantContent);
	}

	// biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
	public inject() {}
}
