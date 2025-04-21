import fs from "node:fs";
import path from "node:path";

type StaticTemplate = {
	name: string;
	path: string;
	content: string;
};

type DynamicTemplate = (mainType: "fastify" | "express") => StaticTemplate;

export type Template = StaticTemplate | DynamicTemplate;

export class BaseGenerator {
	public createFile(
		id: string,
		file: {
			name: string;
			path: string;
			content: string;
		}
	) {
		const dirPath = this.getPath(id, file.path);
		this.mkdir(dirPath);
		const filePath = path.join(dirPath, file.name);

		this.writeFile(filePath, file.content);

		return { fileName: file.name, stream: fs.createReadStream(filePath) };
	}

	public mkdir(dirPath: string) {
		return fs.mkdirSync(dirPath, { recursive: true });
	}

	public writeFile(filePath: string, content: string) {
		return fs.writeFileSync(filePath, content, { encoding: "utf-8" });
	}

	public readFile(filePath: string) {
		return fs.readFileSync(filePath, { encoding: "utf-8" });
	}

	public getPath(id: string, filePath?: string) {
		return path.join(__dirname, "__generated__", id, filePath ?? "");
	}
}
