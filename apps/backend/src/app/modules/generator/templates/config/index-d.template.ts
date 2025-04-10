const content = `
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    PORT: number;
    GLOBAL_PREFIX: string;
  }
}
`;

export const envTypesTemplate = {
	name: "index.d.ts",
	path: "src/types",
	content
};
