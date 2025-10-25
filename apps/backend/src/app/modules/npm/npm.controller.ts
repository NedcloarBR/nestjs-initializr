import { Controller, DefaultValuePipe, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
//biome-ignore lint/style/useImportType: <>
import { NpmService } from "./npm.service";
import { ApiGetPackages } from "./npm.swagger";

@ApiTags("NPM")
@Controller("npm")
export class NpmController {
	public constructor(private readonly npmService: NpmService) {}

	@Get()
	@ApiGetPackages()
	public async getPackages(@Query("name", new DefaultValuePipe("nest")) name: string) {
		return await this.npmService.getPackages(name);
	}
}
