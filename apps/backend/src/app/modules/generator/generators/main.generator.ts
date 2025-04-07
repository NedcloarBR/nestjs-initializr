import { mainExpressTemplate, mainFastifyTemplate } from "../templates/main.template";
import { BaseGenerator } from "./base.generator";
import { AddCommon, AddExpress, AddFastify } from "./functions/dependencies";

type MainTypes = "express" | "fastify";

export function MainGenerator(type: MainTypes, id: string) {
	let content: string;

	switch (type) {
		case "express":
			content = mainExpressTemplate;
			AddExpress(id);
			break;
		case "fastify":
			content = mainFastifyTemplate;
			AddFastify(id);
			break;
	}

	AddCommon(id);

	BaseGenerator(id, "main.ts", content, false, "src");
}
