import type { NPMPackage } from "@/types/npm";
import { useCallback, useState } from "react";

export function useExtraPackages() {
	const [packages, setPackages] = useState<NPMPackage[]>([]);

	const fetchPackages = useCallback(async (packageName?: string) => {
		const baseUrl = process.env.BACKEND_URL!;

		const url = new URL("/api/npm", baseUrl);
		if (packageName) {
			url.searchParams.append("name", packageName);
		}

		try {
			const response = await fetch(url, {
				method: "GET"
			});

			if (!response.ok) {
				throw new Error("Erro ao buscar pacotes adicionais");
			}
			const data = await response.json();
			setPackages(data);
		} catch (error) {
			console.error(error);
		}
	}, []);

	return { packages, fetchPackages };
}
