import { Injectable } from "@nestjs/common";
import { MetadataDTO } from "../dtos/metadata.dto";
import { nestScripts, packageJsonReplaceKeys, packageJsonTemplate } from "../templates";
import { BaseGenerator } from "./base.generator";

@Injectable()
export class PackageJsonService extends BaseGenerator {
  public async generate(metadata: MetadataDTO["packageJson"], id: string) {
    const content = packageJsonTemplate.content
      .replace(packageJsonReplaceKeys.PROJECT_NAME, metadata.name)
      .replace(packageJsonReplaceKeys.PROJECT_DESCRIPTION, metadata.description)
      .replace(packageJsonReplaceKeys.NODE_VERSION, metadata.nodeVersion);

    const file = this.createFile(id, {
      ...packageJsonTemplate,
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
    packageJson.scripts[name] = command;

    this.writeFile(file, JSON.stringify(packageJson, null, 2));
  }

  public async addProperty(id: string, name: string, value: string | Record<string, unknown>) {
    const file = this.getPath(id, "package.json");
    const packageJson = JSON.parse(this.readFile(file));
    packageJson[name] = value;

    this.writeFile(file, JSON.stringify(packageJson, null, 2));
  }
}
