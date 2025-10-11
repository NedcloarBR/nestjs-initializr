import type { generatorFormSchema } from "@/forms/generator-form-schema";
import type { ConfigStructure } from "@/types/config";
import { addRecentHistory } from "@/utils/history";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import type { z } from "zod";

export async function generate(values: z.infer<ReturnType<typeof generatorFormSchema>>, mode: "config" | "project") {
	try {
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
			extraPackages: values.extraPackages.map((pkg) => ({ name: pkg.name, version: pkg.version, dev: pkg.dev }))
		} as ConfigStructure;

		const baseUrl = process.env.BACKEND_URL || "";
		const url = new URL("/api/generator", baseUrl);
		let filename = "project.zip";
		if (mode === "config") {
			url.pathname += "/config";
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
