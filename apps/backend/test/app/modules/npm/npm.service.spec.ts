import "reflect-metadata";
import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Test, type TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { NPM_DEPENDENCIES } from "@/app/constants/packages";
import { NpmService } from "@/app/modules/npm/npm.service";
import type { NPMResponse } from "@/types/npm";

function makePackageObject(name: string): NPMResponse["objects"][number] {
	return {
		package: { name } as NPMResponse["objects"][number]["package"],
		score: { final: 1, detail: { quality: 1, popularity: 1, maintenance: 1 } },
		searchScore: 1,
		flags: { insecure: 0 },
		downloads: { monthly: 0, weekly: 0 },
		dependents: "0",
		updated: new Date()
	} as unknown as NPMResponse["objects"][number];
}

describe("NpmService", () => {
	let service: NpmService;
	let mockCacheManager: { get: jest.Mock; set: jest.Mock };
	let mockHttpService: { get: jest.Mock };

	beforeEach(async () => {
		mockCacheManager = { get: jest.fn(), set: jest.fn() };
		mockHttpService = { get: jest.fn() };

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NpmService,
				{ provide: CACHE_MANAGER, useValue: mockCacheManager },
				{ provide: HttpService, useValue: mockHttpService }
			]
		}).compile();

		service = module.get<NpmService>(NpmService);
	});

	describe("getPackages()", () => {
		it("returns cached data without calling the HTTP service", async () => {
			const cached = [{ package: { name: "cached-pkg" } }];
			mockCacheManager.get.mockResolvedValue(cached);

			const result = await service.getPackages("cached-pkg");

			expect(result).toBe(cached);
			expect(mockHttpService.get).not.toHaveBeenCalled();
		});

		it("fetches from NPM and caches the result on cache miss", async () => {
			mockCacheManager.get.mockResolvedValue(null);
			mockCacheManager.set.mockResolvedValue(undefined);

			const npmResponse: NPMResponse = {
				objects: [makePackageObject("some-lib")],
				total: 1,
				time: new Date()
			};
			mockHttpService.get.mockReturnValue(of({ data: npmResponse }));

			const result = await service.getPackages("some-lib");

			expect(mockHttpService.get).toHaveBeenCalledWith(expect.stringContaining("some-lib"));
			expect(mockCacheManager.set).toHaveBeenCalledWith("npm:packages:some-lib", result);
		});

		it("filters out packages that are in the blacklist", async () => {
			mockCacheManager.get.mockResolvedValue(null);
			mockCacheManager.set.mockResolvedValue(undefined);

			const blacklistedName = Object.values(NPM_DEPENDENCIES)[0].name;
			const npmResponse: NPMResponse = {
				objects: [makePackageObject(blacklistedName), makePackageObject("safe-lib")],
				total: 2,
				time: new Date()
			};
			mockHttpService.get.mockReturnValue(of({ data: npmResponse }));

			const result = (await service.getPackages("test")) as NPMResponse["objects"];

			const names = result.map((p) => p.package.name);
			expect(names).not.toContain(blacklistedName);
			expect(names).toContain("safe-lib");
		});

		it("filters out packages whose names start with a blacklisted scope", async () => {
			mockCacheManager.get.mockResolvedValue(null);
			mockCacheManager.set.mockResolvedValue(undefined);

			const blacklistedName = Object.values(NPM_DEPENDENCIES)[0].name;
			const scopedName = `${blacklistedName}/plugin`;

			const npmResponse: NPMResponse = {
				objects: [makePackageObject(scopedName)],
				total: 1,
				time: new Date()
			};
			mockHttpService.get.mockReturnValue(of({ data: npmResponse }));

			const result = (await service.getPackages("test")) as NPMResponse["objects"];

			const names = result.map((p) => p.package.name);
			expect(names).not.toContain(scopedName);
		});

		it("limits results to 20 packages", async () => {
			mockCacheManager.get.mockResolvedValue(null);
			mockCacheManager.set.mockResolvedValue(undefined);

			const objects = Array.from({ length: 30 }, (_, i) => makePackageObject(`unique-lib-${i}`));
			const npmResponse: NPMResponse = { objects, total: 30, time: new Date() };
			mockHttpService.get.mockReturnValue(of({ data: npmResponse }));

			const result = (await service.getPackages("lib")) as NPMResponse["objects"];

			expect(result.length).toBeLessThanOrEqual(20);
		});

		it("sorts results alphabetically by package name", async () => {
			mockCacheManager.get.mockResolvedValue(null);
			mockCacheManager.set.mockResolvedValue(undefined);

			const npmResponse: NPMResponse = {
				objects: [makePackageObject("z-lib"), makePackageObject("a-lib"), makePackageObject("m-lib")],
				total: 3,
				time: new Date()
			};
			mockHttpService.get.mockReturnValue(of({ data: npmResponse }));

			const result = (await service.getPackages("lib")) as NPMResponse["objects"];
			const names = result.map((p) => p.package.name);

			expect(names).toEqual(["a-lib", "m-lib", "z-lib"]);
		});

		it("uses the package name as part of the cache key", async () => {
			mockCacheManager.get.mockResolvedValue(null);
			mockCacheManager.set.mockResolvedValue(undefined);

			const npmResponse: NPMResponse = { objects: [], total: 0, time: new Date() };
			mockHttpService.get.mockReturnValue(of({ data: npmResponse }));

			await service.getPackages("my-query");

			expect(mockCacheManager.get).toHaveBeenCalledWith("npm:packages:my-query");
		});
	});
});
