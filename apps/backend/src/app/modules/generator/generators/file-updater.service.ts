import { Injectable } from "@nestjs/common";
import { BaseGenerator } from "./base.generator";

@Injectable()
export class FileUpdaterService extends BaseGenerator {
	public async update(id: string, filePath: string, template: { replacer: string; content: string }): Promise<void> {
		const File = this.getPath(id, filePath);

		const Content = this.readFile(File);
		const newContent = Content.replace(template.replacer, template.content);
		this.writeFile(File, newContent);
	}
}
