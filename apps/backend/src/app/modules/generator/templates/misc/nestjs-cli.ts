const content = `
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
`;

export const nestjsCli = {
	name: "nest-cli.json",
	path: "",
	content
};
