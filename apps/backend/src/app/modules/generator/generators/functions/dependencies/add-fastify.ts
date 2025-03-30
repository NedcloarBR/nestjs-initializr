import { NPM_DEPENDENCIES } from "apps/backend/src/app/constants/npm-packages";
import { AddPackage } from "../../package-json.generator";

export function AddFastify(id: string) {
	AddPackage("@nestjs/platform-fastify", "^11.0.11", id);
	AddPackage(NPM_DEPENDENCIES.fastify.name, NPM_DEPENDENCIES.fastify.version, id);
}
