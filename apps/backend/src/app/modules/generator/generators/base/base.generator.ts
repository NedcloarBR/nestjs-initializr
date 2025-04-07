import fs from "node:fs";
import path from "node:path";

export function BaseGenerator(
	id: string,
	fileStructure: {
		name: string;
		path: string;
		content: string;
	},
	returnResult?: boolean
) {
	const dirPath = path.join(__dirname, "__generated__", id, fileStructure.path);

	fs.mkdirSync(dirPath, { recursive: true });

	const filePath = path.join(dirPath, fileStructure.name);

	fs.writeFileSync(filePath, fileStructure.content, { encoding: "utf-8" });

	return returnResult ? { fileName: fileStructure.name, stream: fs.createReadStream(filePath) } : undefined;
}
