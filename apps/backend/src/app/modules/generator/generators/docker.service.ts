import { Injectable } from "@nestjs/common";
import { MetadataDTO } from "../dtos/metadata.dto";
import { dockerComposeTemplate } from "../templates/docker/docker-compose.template";
import { dockerfileTemplate } from "../templates/docker/docker-file.template";
import { BaseGenerator } from "./base.generator";

@Injectable()
export class DockerService extends BaseGenerator {
	public async generate(
		id: string,
		packageManager: MetadataDTO["packageManager"],
		nodeVersion: MetadataDTO["packageJson"]["nodeVersion"],
		projectName: MetadataDTO["packageJson"]["name"]
	) {
		const dockerfile = this.createFile(id, dockerfileTemplate(nodeVersion, packageManager));
		const dockerCompose = this.createFile(id, dockerComposeTemplate(projectName));
		return [dockerfile, dockerCompose];
	}
}
