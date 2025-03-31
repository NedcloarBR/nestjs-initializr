import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import archiver from "archiver";
import { AppGenerator } from "./generators/app.generator";
import { Misc } from "./generators/functions/misc";
import { MainGenerator, type MainTypes } from "./generators/main.generator";
import { PackageJsonGenerator, type PackageJsonMetadata } from "./generators/package-json.generator";

export interface ProjectMetadata {
	packageJson: PackageJsonMetadata;
	mainType: MainTypes;
}
@Injectable()
export class GeneratorService {
	public async generate(metadata: ProjectMetadata): Promise<fs.ReadStream> {
		const id = Date.now().toString();
		const packageJson = PackageJsonGenerator(metadata.packageJson, id);
		MainGenerator(metadata.mainType, id);
		AppGenerator(id);
		Misc(id);

		return await this.generateZipFile([packageJson], id);
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

		await mkdir(dirPath, { recursive: true });

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
