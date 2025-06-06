import type { generatorFormSchema } from "@/forms/generator-form-schema";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import type { z } from "zod";

export async function generateConfig(values: z.infer<ReturnType<typeof generatorFormSchema>>) {
	try {
		const response = await fetch(`${process.env.BACKEND_URL}/api/generator/config`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
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
			})
		});

		if (!response.ok) {
			throw new Error("Error generating the config json file");
		}

		const contentDisposition = response.headers.get("Content-Disposition");
		const fileName = contentDisposition?.split("filename=")[1] || "nestjs-initializr.json";

		const blob = await response.blob();

		saveAs(blob, fileName);
	} catch (error) {
		console.error(error);
		let message = "An unexpected error occurred.";
		if ((error as Error).message === "Failed to fetch") {
			message = "Error connecting to the server.";
		}
		toast.error(message);
	}
}
