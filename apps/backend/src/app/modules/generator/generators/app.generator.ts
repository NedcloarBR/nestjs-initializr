import fs from "node:fs";
import path from "node:path";
import { appControllerTemplate } from "../templates/app/controller.template";
import { appModuleTemplate } from "../templates/app/module.template";
import { appServiceTemplate } from "../templates/app/service.template";

export function AppGenerator(id: string) {
	const moduleContent = appModuleTemplate;
	const controllerContent = appControllerTemplate;
	const serviceContent = appServiceTemplate;

	const dirPath = path.join(__dirname, "__generated__", id, "src");

	fs.mkdirSync(dirPath, { recursive: true });

	const modulePath = path.join(dirPath, "app.module.ts");
	const controllerPath = path.join(dirPath, "app.controller.ts");
	const servicePath = path.join(dirPath, "app.service.ts");

	fs.writeFileSync(modulePath, moduleContent, { encoding: "utf-8" });
	fs.writeFileSync(controllerPath, controllerContent, { encoding: "utf-8" });
	fs.writeFileSync(servicePath, serviceContent, { encoding: "utf-8" });
}
