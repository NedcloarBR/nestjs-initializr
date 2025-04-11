import { Injectable } from "@nestjs/common";
import { BaseGenerator, Template } from "./base.generator";

@Injectable()
export class ModuleService extends BaseGenerator {
  public async generate(
    id: string,
    templates: Template[],
    metadata: { import: string; export: string; importIn?: string }
  ) {
    const rootFiles = [];
    for (const template of templates) {

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

  public inject() { }
}
