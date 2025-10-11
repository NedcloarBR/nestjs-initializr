export interface ConfigStructure {
	packageJson: {
		name: string;
		description: string;
		nodeVersion: "20" | "21" | "22" | "23";
	};
	mainType: "fastify" | "express";
	packageManager: "npm" | "yarn" | "pnpm";
	modules: string[];
	extras: string[];
	linterFormatter: "biome" | "eslint-prettier";
	docker: boolean;
	testRunner: "jest" | "vitest";
}

export function loadConfig(
	event: React.ChangeEvent<HTMLInputElement>,
	// biome-ignore lint/suspicious/noExplicitAny: Next-intl dont export types
	t: (key: any, values?: any | undefined, formats?: any | undefined) => string,
	onDataLoaded: (data: ConfigStructure) => void
) {
	const file = event.target?.files?.[0];
	if (!file) {
		alert(t("loadConfig.noFileSelected"));
		return;
	}

	const reader = new FileReader();

	reader.onload = (e) => {
		try {
			const jsonContent = e.target?.result;
			if (typeof jsonContent === "string") {
				const data = JSON.parse(jsonContent) as ConfigStructure;
				onDataLoaded(data);
			}
			event.target.value = "";
		} catch (error) {
			if (error instanceof Error) {
				alert(t("loadConfig.fileReadError", { ERROR: error.message }));
			} else {
				alert(t("loadConfig.fileReadError"));
			}
		}
	};

	reader.readAsText(file);
}
