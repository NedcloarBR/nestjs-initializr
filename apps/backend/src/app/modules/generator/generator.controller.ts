
import { Body, Controller, Header, Inject, Post, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { Services } from "../../constants/services";
// biome-ignore lint/style/useImportType: Cannot useImportType in body dtos
import { MetadataDTO } from "./dtos/metadata.dto";
// biome-ignore lint/style/useImportType: Cannot useImportType in dependency injection
import { GeneratorService } from "./generator.service";

@Controller("generator")
export class GeneratorController {
  public constructor(@Inject(Services.Generator) private readonly generatorService: GeneratorService) {}

  @Post()
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="project.zip"')
   public async generate(@Res() res: FastifyReply, @Body() metadata: MetadataDTO) {
    const { mainType, packageJson } = metadata;
    const file = await this.generatorService.generate({ mainType, packageJson, modules: ["config"] });
    return res.send(file);
  }
}
