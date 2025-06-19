import fs from "node:fs";
import type { Template } from "@/types";
import { Injectable } from "@nestjs/common";
import { BaseGenerator } from "./base.generator";

@Injectable()
export class ModuleService extends BaseGenerator {
	public async generate(
		id: string,
		templates: Template[],
		metadata: { import: string; export?: string; importIn?: string; importArray?: string },
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

		if (metadata.export) {
			this.updateExport(id, metadata.export);
		}
		if (metadata.importIn) {
			this.updateImport(id, metadata.import, metadata.importArray, metadata.importIn);
		}

		return rootFiles;
	}

	public updateExport(id: string, exportString: string) {
		const allModulesIndexPath = this.getPath(id, "src/modules/index.ts");
		let allModulesIndexContent = this.readFile(allModulesIndexPath);
		allModulesIndexContent += `\n${exportString}`;
		this.writeFile(allModulesIndexPath, allModulesIndexContent);
	}

	public updateImport(id: string, importString: string, importArray: string, moduleToUpdatePath: string) {
		const moduleToUpdatePathResolved = this.getPath(id, moduleToUpdatePath);
		let moduleToUpdateContent = this.readFile(moduleToUpdatePathResolved);

		const importsSectionRegex = /(imports:\s*\[)([\s\S]*?)(\])/;
		const importFromModulesRegex = /import\s+\{\s*([^\}]+)\s*\}\s+from\s+['"]@\/modules['"]/;

		const importsMatch = moduleToUpdateContent.match(importsSectionRegex);
		if (importsMatch && !importsMatch[2].includes(importArray)) {
			moduleToUpdateContent = moduleToUpdateContent.replace(importsSectionRegex, (match, before, middle, after) => {
				return `${before}${middle.trim() ? `${middle.trim()},\n    ${importArray}` : `\n    ${importArray}`}${after}`;
			});
		}

		if (importString === null) return this.writeFile(moduleToUpdatePathResolved, moduleToUpdateContent);

		const importMatch = moduleToUpdateContent.match(importFromModulesRegex);
		if (importMatch) {
			const existingImports = importMatch[1]
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);

			if (!existingImports.includes(importString)) {
				existingImports.push(importString);
			}

			const uniqueImports = [...new Set(existingImports)].sort();

			moduleToUpdateContent = moduleToUpdateContent.replace(
				importFromModulesRegex,
				`import { ${uniqueImports.join(", ")} } from "@/modules"`
			);
		} else {
			moduleToUpdateContent = `import { ${importString} } from "@/modules";\n${moduleToUpdateContent}`;
		}

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
				content: "export const Services = Object.freeze({\n})\n"
			});
			constantFile = this.getPath(id, "src/constants/services.ts");
		}
		const constantContent = this.readFile(constantFile);

		const constantRegex = /export const Services = Object\.freeze\({\n}\)/g;
		const newConstantContent = constantContent.replace(
			constantRegex,
			`export const Services = Object.freeze({\n\t${serviceConstant},\n})`
		);
		this.writeFile(constantFile, newConstantContent);
	}

	// biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
	public inject() {}
}
