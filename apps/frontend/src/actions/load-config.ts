interface ConfigStructure {
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
}

export function loadConfig(event: React.ChangeEvent<HTMLInputElement>, onDataLoaded: (data: ConfigStructure) => void) {
	const file = event.target?.files?.[0];
	if (!file) {
		alert("Nenhum arquivo selecionado.");
		return;
	}
	if (!file) {
		alert("Nenhum arquivo selecionado.");
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
				alert(`Erro ao ler ou parsear o arquivo JSON: ${error.message}`);
			} else {
				alert("Erro ao ler ou parsear o arquivo JSON: Erro desconhecido.");
			}
		}
	};

	reader.readAsText(file);
}
