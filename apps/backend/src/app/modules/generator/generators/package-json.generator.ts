import fs from "node:fs";
import path from "node:path";
import { packageJsonReplaceKeys, packageJsonTemplate } from "../templates/package-json.template";
import { nestScripts } from "../templates/scripts/nest.template";

export interface PackageJsonMetadata {
	name: string;
	description?: string;
	nodeVersion: "20" | "21" | "22" | "23";
}

export function PackageJsonGenerator(metadata: PackageJsonMetadata, id: string) {
	const content = packageJsonTemplate
		.replace(packageJsonReplaceKeys.PROJECT_NAME, metadata.name)
		.replace(packageJsonReplaceKeys.PROJECT_DESCRIPTION, metadata.description)
		.replace(packageJsonReplaceKeys.NODE_VERSION, metadata.nodeVersion);

	const dirPath = path.join(__dirname, "__generated__", id);

	fs.mkdirSync(dirPath, { recursive: true });

	const filePath = path.join(dirPath, "package.json");

	fs.writeFileSync(filePath, content, { encoding: "utf-8" });

	const file = fs.createReadStream(filePath);

	for (const script of Object.values(nestScripts)) {
		AddScript(script.name, script.command, id);
	}

	return { fileName: "package.json", stream: file };
}

export function AddPackage(packageName: string, packageVersion: string, id: string, dev?: boolean) {
	const packageJsonPath = path.join(__dirname, "__generated__", id, "package.json");
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
	!dev
		? // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
			(packageJson.dependencies[packageName] = packageVersion)
		: // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
			(packageJson.devDependencies[packageName] = packageVersion);

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf-8");
}

export function AddScript(scriptName: string, scriptCommand: string, id: string) {
	const packageJsonPath = path.join(__dirname, "__generated__", id, "package.json");
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

	packageJson.scripts[scriptName] = scriptCommand;

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf-8");
}

export function AddProperty(propertyName: string, propertyValue: string | Record<string, unknown>, id: string) {
	const packageJsonPath = path.join(__dirname, "__generated__", id, "package.json");
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

	packageJson[propertyName] = propertyValue;

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf-8");
}
