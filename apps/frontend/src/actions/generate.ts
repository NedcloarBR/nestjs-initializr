import { saveAs } from "file-saver";
import { toast } from "sonner";
import type { z } from "zod";
import type { generatorFormSchema } from "@/forms/generator-form-schema";
import type { ConfigStructure } from "@/types/config";
import { addRecentHistory } from "@/utils/history";

export async function generate(values: z.infer<ReturnType<typeof generatorFormSchema>>, mode: "config" | "project") {
	try {
		const hasPrisma = values.modules?.includes("prisma-standalone");

		const rawBody = {
			mainType: values.mainType,
			packageJson: {
				name: values.projectName,
				description: values.projectDescription,
				nodeVersion: values.nodeVersion
			},
			packageManager: values.packageManager,
			modules: values.modules,
			extras: values.extras,
			linterFormatter: values.linterFormatter,
			docker: values.docker,
			testRunner: values.testRunner,
			extraPackages: values.extraPackages.map((pkg) => ({ name: pkg.name, version: pkg.version, dev: pkg.dev })),
			database: hasPrisma
				? [{ module: "prisma" as const, prismaType: values.database?.prismaType ?? "postgres" }]
				: undefined
		} as ConfigStructure;

		let url = "/api/generator";
    let filename = "project.zip";

    if (mode === "config") {
      url += "/config";
      filename = "nestjs-initializr.json";
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rawBody)
    });

		if (!response.ok) {
			throw new Error(`Error generating the ${mode} file`);
		}

		const contentDisposition = response.headers.get("Content-Disposition");
		const fileName = contentDisposition?.split("filename=")[1] || filename;

		const blob = await response.blob();

		saveAs(blob, fileName);

		addRecentHistory(rawBody);
	} catch (error) {
		console.error(error);
		let message = "An unexpected error occurred.";
		if ((error as Error).message === "Failed to fetch") {
			message = "Error connecting to the server.";
		}
		toast.error(message);
	}
}
