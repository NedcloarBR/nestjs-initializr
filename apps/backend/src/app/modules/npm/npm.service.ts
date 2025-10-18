import { NPM_DEPENDENCIES } from "@/app/constants/packages";
import { resolveAxiosObservable } from "@/app/utils/resolve-axios-observable";
import type { NPMResponse } from "@/types/npm";
// biome-ignore lint/style/useImportType: <>
import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <>
import { Cache } from "cache-manager";

@Injectable()
export class NpmService {
	public constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		private readonly httpService: HttpService
	) {}

	// Exclude packages that are already included in NPM_DEPENDENCIES or are not relevant and clone of others
	private blacklistPackages = [
		...Array.from(Object.values(NPM_DEPENDENCIES)).map((pkg) => pkg.name),
		"nest",
		"@nest/testing",
		"@globalart"
	];

	public async getPackages(name: string) {
		const cacheKey = `npm:packages:${name}`;
		const cached = await this.cacheManager.get(cacheKey);
		if (cached) return cached;

		const { data } = await resolveAxiosObservable<NPMResponse>(
			this.httpService.get<NPMResponse>(`https://registry.npmjs.org/-/v1/search?text=${name}`)
		);

		const packages = this.filterPackages(data.objects);
		await this.cacheManager.set(cacheKey, packages);
		return packages;
	}

	private filterPackages(packages: NPMResponse["objects"]) {
		return packages
			.filter((pkg) => {
				const name = pkg.package.name;

				if (this.blacklistPackages.includes(name)) return false;

				if (this.blacklistPackages.some((b) => name.startsWith(`${b}/`))) return false;

				return true;
			})
			.slice(0, 20)
			.sort((a, b) => a.package.name.localeCompare(b.package.name));
	}
}
