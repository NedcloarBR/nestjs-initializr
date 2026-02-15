import { Plugin } from "@/app/common";
import type { GeneratorContext } from "@/app/common/interfaces";
import { BasePlugin } from "../../core/base-plugin";
import { createDockerComposeTemplate, createDockerfileTemplate, createDockerIgnoreTemplate } from "./templates";

/**
 * Docker Plugin - Generates Docker configuration files
 *
 * This plugin creates:
 * - Dockerfile (with proper package manager commands)
 * - docker-compose.yml
 * - .dockerignore
 */
@Plugin({
	name: "docker",
	displayName: "Docker",
	description: "Docker configuration with Dockerfile, docker-compose.yml, and .dockerignore",
	priority: 100
})
export class DockerPlugin extends BasePlugin {
	shouldActivate(ctx: GeneratorContext): boolean {
		return ctx.metadata.docker;
	}

	protected onGenerate(): void {
		const dockerfile = createDockerfileTemplate(this.nodeVersion, this.packageManager);
		this.createFile(dockerfile.name, dockerfile.path, dockerfile.content);

		const dockerCompose = createDockerComposeTemplate(this.projectName);
		this.createFile(dockerCompose.name, dockerCompose.path, dockerCompose.content);

		const dockerIgnore = createDockerIgnoreTemplate();
		this.createFile(dockerIgnore.name, dockerIgnore.path, dockerIgnore.content);
	}
}
