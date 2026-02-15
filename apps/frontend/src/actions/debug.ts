import { toast } from "sonner";
import type { z } from "zod";
import type { generatorFormSchema } from "@/forms/generator-form-schema";
import type { ConfigStructure } from "@/types/config";
import { addRecentHistory } from "@/utils/history";

export async function getDebugSession() {
  try {
    const response = await fetch("/api/debugger/session", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to create debug session");
    }
    const data = await response.json();
    return data.sessionId as string;
  } catch (error) {
    console.error("Error creating debug session:", error);
    toast.error("Error while creating debug session.");
    return null;
  }
}

export async function startDebug(values: z.infer<ReturnType<typeof generatorFormSchema>>, debugId: string) {
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

		const response = await fetch("/api/debugger/start", {
			method: "POST",
			headers: {
        "Content-Type": "application/json", "x-debug-session-id": debugId },
			body: JSON.stringify(rawBody)
		});

		if (!response.ok) {
			throw new Error("Error starting debug session");
		}

		addRecentHistory(rawBody);
	} catch (error) {
		console.error(error);
		toast.error("Erro ao iniciar debug.");
		return null;
	}
}
