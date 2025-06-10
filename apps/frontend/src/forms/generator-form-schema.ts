import { z } from "zod";

export const generatorFormSchema = (t: (arg: string) => string) =>
	z.object({
		mainType: z.enum(["fastify", "express"]).default("fastify"),
		projectName: z
			.string()
			.min(1, t("FormSchema.projectName.min"))
			.max(214, t("FormSchema.projectName.max"))
			.regex(/^(?:@[a-z0-9-*~][a-z0-9-._~]*\/)?[a-z0-9-*~][a-z0-9-._~]*$/, t("FormSchema.projectName.regex"))
			.default(t("FormSchema.projectName.default")),
		projectDescription: z.string().optional().default(t("FormSchema.projectDescription.default")),
		nodeVersion: z.enum(["20", "21", "22", "23", "24"]).default("20"),
		packageManager: z.enum(["npm", "yarn", "pnpm"]).default("npm"),
		modules: z.array(z.string()).optional().default([]),
		extras: z.array(z.string()).optional().default([]),
		linterFormatter: z.enum(["biome", "eslint-prettier"]).optional().nullable().default(null),
		docker: z.boolean().optional().default(false),
		testRunner: z.enum(["jest", "vitest"]).optional().nullable().default(null)
	});
