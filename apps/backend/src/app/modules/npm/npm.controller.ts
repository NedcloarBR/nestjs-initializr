import { Controller, DefaultValuePipe, Get, Query } from "@nestjs/common";
//biome-ignore lint/style/useImportType: <>
import { NpmService } from "./npm.service";

@Controller("npm")
export class NpmController {
	public constructor(private readonly npmService: NpmService) {}

	@Get()
	public async getPackages(@Query("name", new DefaultValuePipe("nest")) name: string) {
		return await this.npmService.getPackages(name);
	}
}
