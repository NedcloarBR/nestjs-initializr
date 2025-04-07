import fs from "node:fs";
import path from "node:path";

export function BaseGenerator(
	id: string,
	fileName: string,
	content: string,
	returnResult?: boolean,
	gen_path?: string
) {
	const dirPath = path.join(__dirname, "__generated__", id, gen_path);

	fs.mkdirSync(dirPath, { recursive: true });

	const filePath = path.join(dirPath, fileName);

	fs.writeFileSync(filePath, content, { encoding: "utf-8" });

	return returnResult ? { fileName, stream: fs.createReadStream(filePath) } : undefined;
}
