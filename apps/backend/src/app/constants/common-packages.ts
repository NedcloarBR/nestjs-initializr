import { DEV_NPM_DEPENDENCIES, NPM_DEPENDENCIES } from "./npm-packages";

export const commonPackages = [
  {
    name: NPM_DEPENDENCIES["@nestjs/common"].name,
    version: NPM_DEPENDENCIES["@nestjs/common"].version,
    dev: false,
  },
  {
    name: NPM_DEPENDENCIES["@nestjs/core"].name,
    version: NPM_DEPENDENCIES["@nestjs/core"].version,
    dev: false,
  },
  {
    name: NPM_DEPENDENCIES["reflect-metadata"].name,
    version: NPM_DEPENDENCIES["reflect-metadata"].version,
    dev: false,
  },
  {
    name: NPM_DEPENDENCIES["rxjs"].name,
    version: NPM_DEPENDENCIES["rxjs"].version,
    dev: false,
  },
  {
    name: DEV_NPM_DEPENDENCIES["@types/node"].name,
    version: DEV_NPM_DEPENDENCIES["@types/node"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["@nestjs/cli"].name,
    version: DEV_NPM_DEPENDENCIES["@nestjs/cli"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["@nestjs/schematics"].name,
    version: DEV_NPM_DEPENDENCIES["@nestjs/schematics"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["@nestjs/testing"].name,
    version: DEV_NPM_DEPENDENCIES["@nestjs/testing"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["globals"].name,
    version: DEV_NPM_DEPENDENCIES["globals"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["source-map-support"].name,
    version: DEV_NPM_DEPENDENCIES["source-map-support"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["ts-loader"].name,
    version: DEV_NPM_DEPENDENCIES["ts-loader"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["ts-node"].name,
    version: DEV_NPM_DEPENDENCIES["ts-node"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["tsconfig-paths"].name,
    version: DEV_NPM_DEPENDENCIES["tsconfig-paths"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["typescript"].name,
    version: DEV_NPM_DEPENDENCIES["typescript"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["@swc/cli"].name,
    version: DEV_NPM_DEPENDENCIES["@swc/cli"].version,
    dev: true,
  },
  {
    name: DEV_NPM_DEPENDENCIES["@swc/core"].name,
    version: DEV_NPM_DEPENDENCIES["@swc/core"].version,
    dev: true,
  },
]
