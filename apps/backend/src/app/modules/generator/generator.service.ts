import fs from "node:fs";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import archiver from "archiver";
import { commonPackages } from "../../constants/common-packages";
import { expressPackages } from "../../constants/express-packages";
import { fastifyPackages } from "../../constants/fastify-packages";
import { MetadataDTO } from "./dtos/metadata.dto";
import { BaseGenerator } from "./generators/base.generator";
import { ModuleService } from "./generators/module.service";
import { PackageJsonService } from "./generators/package-json.service";
import {
  appControllerTemplate,
  appModuleTemplate,
  appServiceTemplate,
  mainExpressTemplate,
  mainFastifyTemplate,
  nestjsCli,
  readmeTemplate
} from "./templates";
import { modulesTemplates } from "./templates/modules.template";
import { tsconfig, tsconfigBuild } from "./templates/tsconfig.template";
import { MainUpdaterService } from "./generators/main-updater.service";

@Injectable()
export class GeneratorService extends BaseGenerator {
  public constructor(
    private readonly packageJsonGenerator: PackageJsonService,
    private readonly moduleGenerator: ModuleService,
    private readonly mainUpdater: MainUpdaterService
  ) {
    super();
  }

  public async generate(metadata: MetadataDTO): Promise<fs.ReadStream> {
    const id = Date.now().toString();
    const packageJson = await this.packageJsonGenerator.generate(metadata.packageJson, id);
    const rootDirFiles = [packageJson];

    const packageManagers = {
      npm: "package-lock.json",
      yarn: "yarn.lock",
      pnpm: "pnpm-lock.yaml"
    }
    const lockFile = this.createFile(id, {
      name: packageManagers[metadata.packageManager],
      path: "",
      content: ""
    });
    rootDirFiles.push(lockFile);

    switch (metadata.mainType) {
      case "express":
        this.createFile(id, mainExpressTemplate);
        for (const packageMeta of expressPackages) {
          await this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
        }
        break;
      case "fastify":
        this.createFile(id, mainFastifyTemplate);
        for (const packageMeta of fastifyPackages) {
          await this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
        }
        break;
    }
    for (const packageMeta of commonPackages) {
      await this.packageJsonGenerator.addPackage(id, packageMeta.name, packageMeta.version, packageMeta.dev);
    }

    this.createFile(id, appModuleTemplate);
    this.createFile(id, appControllerTemplate);
    this.createFile(id, appServiceTemplate);

    rootDirFiles.push(...[
      this.createFile(id, tsconfig),
      this.createFile(id, tsconfigBuild),
      this.createFile(id, nestjsCli),
      this.createFile(id, readmeTemplate)
    ])

    if (metadata.modules.length > 0) {
      this.createFile(id, { name: "index.ts", path: "src/modules", content: "" });
    }

    for (const module of metadata.modules) {
      const moduleFiles = modulesTemplates.find((m) => m.name === module);
      const moduleRootFiles = await this.moduleGenerator.generate(id, moduleFiles.templates, {
        export: moduleFiles.constants.exporter,
        import: moduleFiles.constants.name,
        importIn: "src/app.module.ts"
      });
      rootDirFiles.push(...moduleRootFiles);
      if (moduleFiles.constants.serviceConstant) {
        this.moduleGenerator.updateServiceConstants(id, moduleFiles.constants.serviceConstant);
      }
      if (moduleFiles.mainTemplates) {
        const templates = moduleFiles.mainTemplates(metadata.mainType);
        for (const template of templates) {
          this.mainUpdater.update(id, template);
        }
      }
    }

    return await this.generateZipFile(rootDirFiles, id);
  }

  private async generateZipFile(
    files: {
      fileName: string;
      stream: fs.ReadStream;
    }[],
    id: string
  ): Promise<fs.ReadStream> {
    const dirPath = path.join(__dirname, "__generated__", id);
    const srcPath = path.join(dirPath, "src");
    const zipPath = path.join(dirPath, "project.zip");

    this.mkdir(dirPath);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }
    });

    archive.pipe(output);

    for (const file of files) {
      archive.append(file.stream, { name: file.fileName });
    }

    archive.directory(srcPath, "src");

    await new Promise((resolve, reject) => {
      output.on("close", resolve);
      output.on("error", reject);
      archive.finalize();
    });

    return fs.createReadStream(zipPath);
  }
}
