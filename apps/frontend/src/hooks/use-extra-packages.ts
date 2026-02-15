import { useCallback, useState } from "react";
import type { NPMPackage } from "@/types/npm";

export function useExtraPackages() {
	const [packages, setPackages] = useState<NPMPackage[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchPackages = useCallback(async (packageName?: string) => {
		const query = packageName ? `?name=${encodeURIComponent(packageName)}` : "";
		const url = `/api/npm${query}`;

		try {
			setLoading(true);
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
		} finally {
			setLoading(false);
		}
	}, []);

	return { packages, fetchPackages, loading };
}
