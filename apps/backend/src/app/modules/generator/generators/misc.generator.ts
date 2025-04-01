import fs from "node:fs";
import path from "node:path";

export function MiscGenerator(content: string, fileName: string, id: string) {
	const dirPath = path.join(__dirname, "__generated__", id);

	fs.mkdirSync(dirPath, { recursive: true });

	const filePath = path.join(dirPath, fileName);

	fs.writeFileSync(filePath, content, { encoding: "utf-8" });

	const file = fs.createReadStream(filePath);

	return { fileName: fileName, stream: file };
}
