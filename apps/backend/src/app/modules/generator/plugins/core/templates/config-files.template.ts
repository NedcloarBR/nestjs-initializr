import type { StaticTemplate } from "@/types";

export const nestCliTemplate: StaticTemplate = {
	name: "nest-cli.json",
	path: "",
	content: `
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
`.trim()
};

export const tsconfigTemplate: StaticTemplate = {
	name: "tsconfig.json",
	path: "",
	content: `
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "typeRoots": ["./node_modules/@types", "./src/types"],
    "incremental": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
`.trim()
};

export const tsconfigBuildTemplate: StaticTemplate = {
	name: "tsconfig.build.json",
	path: "",
	content: `
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
`.trim()
};

export const configFilesTemplates: StaticTemplate[] = [nestCliTemplate, tsconfigTemplate, tsconfigBuildTemplate];
