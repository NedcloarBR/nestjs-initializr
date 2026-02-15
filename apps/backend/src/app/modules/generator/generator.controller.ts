import { Body, Controller, Header, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { FastifyReply, FastifyRequest } from "fastify";
// biome-ignore lint/style/useImportType: Cannot useImportType in body dtos
import { MetadataDTO } from "./dtos/metadata.dto";
import { ApiGenerateConfig, ApiGenerateProject } from "./generator.swagger";
// biome-ignore lint/style/useImportType: Cannot useImportType in dependency injection
import { PluginGeneratorService } from "./plugin-generator.service";

@ApiTags("Generator")
@Controller("generator")
export class GeneratorController {
	public constructor(private readonly generatorService: PluginGeneratorService) {}

	@Post()
	@Header("Content-Type", "application/zip")
	@Header("Content-Disposition", 'attachment; filename="project.zip"')
	@ApiGenerateProject()
	public async generate(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Body() metadata: MetadataDTO) {
		const file = await this.generatorService.generate(metadata, req.requestId);
		return res.status(HttpStatus.CREATED).send(file);
	}

	@Post("config")
	@Header("Content-Type", "application/json")
	@Header("Content-Disposition", 'attachment; filename="nestjs-initializer.json"')
	@ApiGenerateConfig()
	public async generateConfig(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Body() metadata: MetadataDTO) {
		const file = await this.generatorService.generateConfigFile(metadata, req.requestId);
		return res.status(HttpStatus.CREATED).send(file);
	}
}
