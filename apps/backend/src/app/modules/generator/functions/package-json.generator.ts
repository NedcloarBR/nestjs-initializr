import fs from "node:fs";
import path from "node:path";
import { packageJsonReplaceKeys, packageJsonTemplate } from "../templates/package-json.template";

export interface PackageJsonMetadata {
	name: string;
	description: string;
	nodeVersion: string;
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

	return { fileName: "package.json", stream: file };
}
