export const content = `
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    PORT: number;
    GLOBAL_PREFIX: string;
  }
}
`;
