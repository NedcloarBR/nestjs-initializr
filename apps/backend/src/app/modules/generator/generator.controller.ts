import { Body, Controller, Header, HttpStatus, Inject, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { FastifyReply, FastifyRequest } from "fastify";
import { Services } from "../../constants/services";
// biome-ignore lint/style/useImportType: Cannot useImportType in body dtos
import { MetadataDTO } from "./dtos/metadata.dto";
// biome-ignore lint/style/useImportType: Cannot useImportType in dependency injection
import { GeneratorService } from "./generator.service";
import { ApiGenerateConfig, ApiGenerateProject } from "./generator.swagger";

@ApiTags("Generator")
@Controller("generator")
export class GeneratorController {
	public constructor(@Inject(Services.Generator) private readonly generatorService: GeneratorService) {}

	@Post()
	@Header("Content-Type", "application/json")
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
		const { stream: file } = await this.generatorService.generateConfigFile(metadata, req.requestId);
		return res.status(HttpStatus.CREATED).send(file);
	}
}
