import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import archiver from "archiver";
import { PackageJsonGenerator, PackageJsonMetadata } from "./functions/package-json.generator";

@Injectable()
export class GeneratorService {
	public async generate(packageJsonMetadata: PackageJsonMetadata): Promise<fs.ReadStream> {
		const id = Date.now().toString();
		const packageJson = PackageJsonGenerator(packageJsonMetadata, id);

		return await this.generateZipFile([packageJson], id);
	}

	private async generateZipFile(files: any[], id: string): Promise<fs.ReadStream> {
		const dirPath = path.join(__dirname, "__generated__", id);
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

		await new Promise((resolve, reject) => {
			output.on("close", resolve);
			output.on("error", reject);
			archive.finalize();
		});

		return fs.createReadStream(zipPath);
	}
}
