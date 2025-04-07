import { mainExpressTemplate, mainFastifyTemplate } from "../templates/main.template";
import { BaseGenerator } from "./base/base.generator";
import { AddCommon, AddExpress, AddFastify } from "./functions/dependencies";

type MainTypes = "express" | "fastify";

export function MainGenerator(type: MainTypes, id: string) {
	let template: {
		name: string;
		path: string;
		content: string;
	};

	switch (type) {
		case "express":
			template = mainExpressTemplate;
			AddExpress(id);
			break;
		case "fastify":
			template = mainFastifyTemplate;
			AddFastify(id);
			break;
	}

	AddCommon(id);

	BaseGenerator(id, template);
}
