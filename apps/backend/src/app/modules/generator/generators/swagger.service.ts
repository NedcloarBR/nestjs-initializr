import fs from "node:fs";
import { Injectable } from "@nestjs/common";
import { swaggerLibIndex, swaggerLibTemplate, swaggerMainTemplate } from "../templates/swagger";
import { BaseGenerator } from "./base.generator";
// biome-ignore lint/style/useImportType: <explanation>
import { MainUpdaterService } from "./main-updater.service";

@Injectable()
export class SwaggerService extends BaseGenerator {
	public constructor(private readonly mainUpdaterGenerator: MainUpdaterService) {
		super();
	}

	public async generate(id: string, mainType: "fastify" | "express", withConfigModule: boolean): Promise<void> {
		let libIndex = fs.existsSync(this.getPath(id, "src/lib/index.ts"))
			? this.getPath(id, "src/lib/index.ts")
			: undefined;
		if (!libIndex) {
			this.createFile(id, swaggerLibIndex);
			libIndex = this.getPath(id, "src/lib/index.ts");
		}
		let libContent = this.readFile(libIndex);
		libContent += `\n${swaggerLibIndex.content}`;

		this.createFile(id, swaggerLibTemplate(mainType));
		for (const template of swaggerMainTemplate(withConfigModule)) {
			await this.mainUpdaterGenerator.update(id, template);
		}
	}
}
