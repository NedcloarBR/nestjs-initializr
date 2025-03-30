import { NPM_DEPENDENCIES } from "apps/backend/src/app/constants/npm-packages";
import { AddPackage } from "../../package-json.generator";

export function AddExpress(id: string) {
	AddPackage(
		NPM_DEPENDENCIES["@nestjs/platform-express"].name,
		NPM_DEPENDENCIES["@nestjs/platform-express"].version,
		id
	);
	AddPackage(NPM_DEPENDENCIES["express"].name, NPM_DEPENDENCIES["express"].version, id);
}
