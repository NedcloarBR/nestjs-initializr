const tsconfigContent = `
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
`;

const tsconfigBuildContent = `
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
`;

export const tsconfig = {
	name: "tsconfig.json",
	path: "",
	content: tsconfigContent
};

export const tsconfigBuild = {
	name: "tsconfig.json",
	path: "",
	content: tsconfigBuildContent
};
