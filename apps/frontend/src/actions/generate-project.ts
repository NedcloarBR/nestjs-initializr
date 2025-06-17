import type { generatorFormSchema } from "@/forms/generator-form-schema";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { z } from "zod";
import { ConfigStructure } from "./load-config";

export async function generateProject(values: z.infer<ReturnType<typeof generatorFormSchema>>) {
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
			testRunner: values.testRunner
		};

		const response = await fetch(`${process.env.BACKEND_URL}/api/generator`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(rawBody)
		});

		if (!response.ok) {
			throw new Error("Error generating the project zip file");
		}

		const contentDisposition = response.headers.get("Content-Disposition");
		const fileName = contentDisposition?.split("filename=")[1] || "project.zip";

		const blob = await response.blob();

		saveAs(blob, fileName);

		const MAX_HISTORY = 10;
		const recentHistory = JSON.parse(localStorage.getItem("recentHistory") || "[]") as ConfigStructure[];
		const filtered = recentHistory.filter((item) => item.packageJson.name !== rawBody.packageJson.name);
		const updatedHistory = [rawBody, ...filtered];
		const limitedHistory = updatedHistory.slice(0, MAX_HISTORY);
		localStorage.setItem("recentHistory", JSON.stringify(limitedHistory));
	} catch (error) {
		console.error(error);
		let message = "An unexpected error occurred.";
		if ((error as Error).message === "Failed to fetch") {
			message = "Error connecting to the server.";
		}
		toast.error(message);
	}
}
