import fs from "node:fs";
import path from "node:path";
import dedent from "dedent";

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
		let content = file.content;
		const notDedent = [".ts", ".js", ".json", ".env"];
		if (!notDedent.some((ext) => file.name.endsWith(ext))) {
			content = dedent(file.content);
		}

		this.writeFile(filePath, content);

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
