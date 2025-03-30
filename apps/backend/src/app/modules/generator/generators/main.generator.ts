import fs from "node:fs";
import path from "node:path";
import { mainBasicTemplate, mainFastifyTemplate } from "../templates/main.template";
import { AddCommon, AddExpress, AddFastify } from "./functions/dependencies";

export type MainTypes = "basic" | "fastify";

export function MainGenerator(type: MainTypes, id: string) {
	let content: string;

	switch (type) {
		case "basic":
			content = mainBasicTemplate;
			AddExpress(id);
			break;
		case "fastify":
			content = mainFastifyTemplate;
			AddFastify(id);
			break;
	}

	AddCommon(id);

	const dirPath = path.join(__dirname, "__generated__", id, "src");

	fs.mkdirSync(dirPath, { recursive: true });

	const mainPath = path.join(dirPath, "main.ts");

	fs.writeFileSync(mainPath, content, { encoding: "utf-8" });
}
