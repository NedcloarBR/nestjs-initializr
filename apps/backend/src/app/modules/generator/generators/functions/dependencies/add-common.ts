import { DEV_NPM_DEPENDENCIES, NPM_DEPENDENCIES } from "apps/backend/src/app/constants/npm-packages";
import { AddPackage } from "../../package-json.generator";

export function AddCommon(id: string) {
	// Dependencies
	AddPackage(NPM_DEPENDENCIES["@nestjs/common"].name, NPM_DEPENDENCIES["@nestjs/common"].version, id);
	AddPackage(NPM_DEPENDENCIES["@nestjs/core"].name, NPM_DEPENDENCIES["@nestjs/core"].version, id);
	AddPackage(NPM_DEPENDENCIES["reflect-metadata"].name, NPM_DEPENDENCIES["reflect-metadata"].version, id);
	AddPackage(NPM_DEPENDENCIES["rxjs"].name, NPM_DEPENDENCIES["rxjs"].version, id);
	// Dev dependencies
	AddPackage(DEV_NPM_DEPENDENCIES["@types/node"].name, DEV_NPM_DEPENDENCIES["@types/node"].version, id, true);
	AddPackage(DEV_NPM_DEPENDENCIES["@nestjs/cli"].name, DEV_NPM_DEPENDENCIES["@nestjs/cli"].version, id, true);
	AddPackage(
		DEV_NPM_DEPENDENCIES["@nestjs/schematics"].name,
		DEV_NPM_DEPENDENCIES["@nestjs/schematics"].version,
		id,
		true
	);
	AddPackage(DEV_NPM_DEPENDENCIES["@nestjs/testing"].name, DEV_NPM_DEPENDENCIES["@nestjs/testing"].version, id, true);
	AddPackage(DEV_NPM_DEPENDENCIES["globals"].name, DEV_NPM_DEPENDENCIES["globals"].version, id, true);
	AddPackage(
		DEV_NPM_DEPENDENCIES["source-map-support"].name,
		DEV_NPM_DEPENDENCIES["source-map-support"].version,
		id,
		true
	);
	AddPackage(DEV_NPM_DEPENDENCIES["ts-loader"].name, DEV_NPM_DEPENDENCIES["ts-loader"].version, id, true);
	AddPackage(DEV_NPM_DEPENDENCIES["ts-node"].name, DEV_NPM_DEPENDENCIES["ts-node"].version, id, true);
	AddPackage(DEV_NPM_DEPENDENCIES["tsconfig-paths"].name, DEV_NPM_DEPENDENCIES["tsconfig-paths"].version, id, true);
	AddPackage(DEV_NPM_DEPENDENCIES["typescript"].name, DEV_NPM_DEPENDENCIES["typescript"].version, id, true);
	AddPackage(DEV_NPM_DEPENDENCIES["@swc/cli"].name, DEV_NPM_DEPENDENCIES["@swc/cli"].version, id, true);
	AddPackage(DEV_NPM_DEPENDENCIES["@swc/core"].name, DEV_NPM_DEPENDENCIES["@swc/core"].version, id, true);
}
