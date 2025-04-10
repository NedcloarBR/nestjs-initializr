import { tsconfig, tsconfigBuild } from './templates/tsconfig.template';
import fs from "node:fs";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import archiver from "archiver";
import { MetadataDTO } from "./dtos/metadata.dto";
import { BaseGenerator } from "./generators";
import { PackageJsonService } from "./generators/package-json.service";
import { appControllerTemplate, appModuleTemplate, appServiceTemplate, mainExpressTemplate, mainFastifyTemplate, nestjsCli, readmeTemplate } from "./templates";
import { expressPackages } from "../../constants/express-packages";
import { fastifyPackages } from "../../constants/fastify-packages";
import { commonPackages } from "../../constants/common-packages";
export interface ProjectMetadata {
  packageJson: MetadataDTO["packageJson"];
  mainType: MetadataDTO["mainType"];
  modules: MetadataDTO["modules"];
}

@Injectable()
export class GeneratorService extends BaseGenerator {
  public constructor(
    private readonly packageJsonGenerator: PackageJsonService,
  ) {
    super();
  }


  public async generate(metadata: ProjectMetadata): Promise<fs.ReadStream> {
    const id = Date.now().toString();
    const packageJson = await this.packageJsonGenerator.generate(metadata.packageJson, id);

    switch (metadata.mainType) {
      case "express":
        this.createFile(id, mainExpressTemplate)
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

    const rootFiles = [
      this.createFile(id, tsconfig),
      this.createFile(id, tsconfigBuild),
      this.createFile(id, nestjsCli),
      this.createFile(id, readmeTemplate)
    ];



    return await this.generateZipFile([packageJson, ...rootFiles], id);
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
      console.log("file", file);
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
