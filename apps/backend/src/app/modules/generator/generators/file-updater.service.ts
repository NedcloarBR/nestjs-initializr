import fs from "node:fs";
import { Injectable } from "@nestjs/common";
import { BaseGenerator } from "./base.generator";

@Injectable()
export class FileUpdaterService extends BaseGenerator {
	public async update(id: string, filePath: string, fileName: string, template: { replacer: string; content: string }) {
		const File = fs.existsSync(this.getPath(id, `${filePath}/${fileName}`))
			? this.getPath(id, `${filePath}/${fileName}`)
			: undefined;

		if (!File) {
			const createdFile = this.createFile(id, { path: filePath, name: fileName, content: template.content });
			return createdFile;
		}
		const Content = this.readFile(File);
		const newContent = template.replacer
			? Content.replace(template.replacer, template.content)
			: `${Content}\n${template.content}`;
		this.writeFile(File, newContent);
	}
}
