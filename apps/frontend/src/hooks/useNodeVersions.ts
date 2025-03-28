import { useEffect, useState } from "react";

type NodeVersion = {
	version: string;
	date: string;
	files: string[];
	npm: string;
	v8: string;
	zlib: string;
	openssl: string;
	modules: string;
	lts: boolean | string;
	security: boolean;
};

export function useNodeVersions(minVersion: string, onlyLts: boolean) {
	const [versions, setVersions] = useState<NodeVersion[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const minVersionArr = minVersion
			.replace("v", "")
			.split(".")
			.map((semver) => Number(semver));

		async function fetchVersions() {
			try {
				setLoading(true);
				const response = await fetch("https://nodejs.org/download/release/index.json");
				const data = (await response.json()) as NodeVersion[];

				const filtered = data.filter((v) => {
					const versionArr = v.version.replace("v", "").split(".").map(Number);

					if (onlyLts && versionArr[0] % 2 !== 0) return false;
					if (versionArr[0] > minVersionArr[0]) return true;
					if (versionArr[0] === minVersionArr[0] && versionArr[1] > minVersionArr[1]) return true;
					if (
						versionArr[0] === minVersionArr[0] &&
						versionArr[1] === minVersionArr[1] &&
						versionArr[2] >= minVersionArr[2]
					)
						return true;
					return false;
				});
				setVersions(filtered);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		}

		fetchVersions();
	}, [minVersion, onlyLts]);

	return { versions, loading, error };
}
