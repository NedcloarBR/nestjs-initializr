// import fs from "node:fs";
// import path from "node:path";

// export function ModuleUpdaterGenerator(
// 	id: string,
// 	moduleExport: string,
// 	moduleImport: string,
// 	moduleName: string,
// 	addToModulePath: string
// ) {
// 	const modulesIndexPath = path.join(__dirname, "__generated__", id, "src/modules/index.ts");

// 	let modulesIndexContent = fs.readFileSync(modulesIndexPath, { encoding: "utf-8" });
// 	modulesIndexContent += `${moduleExport}\n`;

// 	fs.writeFileSync(modulesIndexPath, modulesIndexContent);

// 	const addModulePath = path.join(__dirname, "__generated__", id, addToModulePath);

// 	const importsRegex = /(imports:\s*\[)([\s\S]*?)(\])/;

// 	let addModuleContent = fs.readFileSync(addModulePath, { encoding: "utf-8" });

// 	if (!addModuleContent.includes(moduleImport)) {
// 		addModuleContent = `${moduleImport}\n${addModuleContent}`;
// 	}

// 	if (!addModuleContent.includes(moduleName)) {
// 		addModuleContent = addModuleContent.replace(importsRegex, `$1$2${moduleName},\n$3`);
// 	}
// }
