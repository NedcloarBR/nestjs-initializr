import { Injectable } from "@nestjs/common";
import { BaseGenerator } from "./base.generator";

@Injectable()
export class MainUpdaterService extends BaseGenerator {
	public async update(id: string, template: { replacer: string; content: string }): Promise<void> {
		const mainFile = this.getPath(id, "src/main.ts");

		const mainContent = this.readFile(mainFile);
		const newContent = mainContent.replace(template.replacer, template.content);
		this.writeFile(mainFile, newContent);
	}
}
