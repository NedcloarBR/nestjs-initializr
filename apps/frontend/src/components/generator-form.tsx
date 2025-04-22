"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Label,
	RadioGroup,
	RadioGroupItem,
	ScrollArea,
	Separator
} from "./ui";

import { extraFields, modules, nodeVersions, packageManagers } from "@/constants";
import { saveAs } from "file-saver";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ExtraField } from "./extra-field";
import { LinterFormatterCard } from "./linter-formatter-card";
import { ModuleCard } from "./module-card";

const formSchemaFunction = (t: (arg: string) => string) =>
	z.object({
		mainType: z.enum(["fastify", "express"]).default("fastify"),
		projectName: z
			.string()
			.min(1, t("FormSchema.projectName.min"))
			.max(214, t("FormSchema.projectName.max"))
			.regex(/^(?:@[a-z0-9-*~][a-z0-9-._~]*\/)?[a-z0-9-*~][a-z0-9-._~]*$/, t("FormSchema.projectName.regex"))
			.default(t("FormSchema.projectName.default")),
		projectDescription: z.string().optional().default(t("FormSchema.projectDescription.default")),
		nodeVersion: z.enum(["20", "21", "22", "23"]).default("20"),
		packageManager: z.enum(["npm", "yarn", "pnpm"]).default("npm"),
		modules: z.array(z.string()).optional().default([]),
		extras: z.array(z.string()).optional().default([]),
		linterFormatter: z.enum(["biome", "eslint-prettier"])
	});

export function GeneratorForm() {
	const t = useTranslations("Generator");
	const formSchema = formSchemaFunction(t);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			projectName: t("FormSchema.projectName.default"),
			projectDescription: t("FormSchema.projectDescription.default"),
			nodeVersion: "20",
			mainType: "fastify",
			packageManager: "npm",
			modules: [],
			extras: []
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await fetch("http://localhost:9901/api/generator", {
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
					linterFormatter: values.linterFormatter
				})
			});

			if (!response.ok) {
				throw new Error("Error generating the project zip file");
			}

			const contentDisposition = response.headers.get("Content-Disposition");
			const fileName = contentDisposition?.split("filename=")[1] || "project.zip";

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

	return (
		<section id="generator-form" className="m-32">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex">
						<div className="flex-1 space-y-8 rounded-lg bg-nest-header-background p-8">
							<h2 className="font-bold">{t("Metadata.title")}</h2>

							<FormField
								name="projectName"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex max-w-xl items-center space-x-4">
										<FormLabel className="w-20">{t("Metadata.name")}</FormLabel>
										<FormControl className="flex-1">
											<Input {...field} className="w-full" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								name="projectDescription"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex max-w-xl items-center space-x-4">
										<FormLabel className="w-20">{t("Metadata.description")}</FormLabel>
										<FormControl className="flex-1">
											<Input {...field} className="w-full" />
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								name="nodeVersion"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex max-w-xl items-center space-x-4">
										<FormLabel className="w-20">{t("Metadata.nodeVersion")}</FormLabel>
										<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
											{nodeVersions.map((version) => (
												<div key={version} className="flex items-center">
													<FormControl>
														<Label
															htmlFor={version}
															className={`ml-2 cursor-pointer ${field.value === version ? "text-nest-primary" : ""}`}>
															<RadioGroupItem className="custom-radio cursor-pointer" value={version} id={version} />
															{version}
														</Label>
													</FormControl>
												</div>
											))}
										</RadioGroup>
									</FormItem>
								)}
							/>

							<FormField
								name="mainType"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex max-w-xl items-center space-x-4">
										<FormLabel className="w-20">{t("Metadata.mainType")}</FormLabel>
										<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
											<FormControl>
												<Label
													htmlFor="fastify"
													className={`ml-2 cursor-pointer ${field.value === "fastify" ? "text-nest-primary" : ""}`}>
													<RadioGroupItem className="custom-radio cursor-pointer" value="fastify" id="fastify" />
													Fastify
												</Label>
											</FormControl>
											<FormControl>
												<Label
													htmlFor="express"
													className={`ml-2 cursor-pointer ${field.value === "express" ? "text-nest-primary" : ""}`}>
													<RadioGroupItem className="custom-radio cursor-pointer" value="express" id="express" />
													Express
												</Label>
											</FormControl>
										</RadioGroup>
									</FormItem>
								)}
							/>
							<FormField
								name="packageManager"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex max-w-xl items-center space-x-4">
										<FormLabel className="w-20">{t("Metadata.packageManager")}</FormLabel>
										<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-12">
											{packageManagers.map((manager) => (
												<FormControl key={manager}>
													<Label
														htmlFor={manager}
														className={`ml-2 cursor-pointer ${field.value === manager ? "text-nest-primary" : ""}`}>
														<RadioGroupItem className="custom-radio cursor-pointer" value={manager} id={manager} />
														<img src={`/icons/packageManagers/${manager}.svg`} alt={`${manager} icon`} />
													</Label>
												</FormControl>
											))}
										</RadioGroup>
									</FormItem>
								)}
							/>
							<Dialog>
								<DialogTrigger asChild>
									<Button className="cursor-pointer">{t("Extra.trigger")}</Button>
								</DialogTrigger>
								<DialogContent className="flex">
									<DialogHeader>
										<DialogTitle>{t("Extra.title")}</DialogTitle>
										<DialogDescription className="pt-4">
											{extraFields(t).map((extra) => (
												<ExtraField
													key={extra.name}
													name={extra.name}
													title={extra.title}
													description={extra.description}
												/>
											))}
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog>
						</div>

						<div className="pr-16 pl-16">
							<Separator orientation="vertical" />
						</div>

						<aside className="space-y-8 overflow-hidden rounded-lg bg-nest-header-background p-8">
							<h2 className="font-bold">{t("Modules.title")}</h2>
							<ScrollArea className="h-96">
								<div className="flex flex-wrap justify-start gap-4">
									{modules(t).map((module) => (
										<ModuleCard
											key={module.name}
											title={module.title}
											name={module.name}
											description={module.description}
										/>
									))}
									<LinterFormatterCard
										key="biome"
										title={t("LinterFormatter.biome.title")}
										name="biome"
										description={t("LinterFormatter.biome.description")}
										disableText={t("LinterFormatter.biome.disableText")}
										iconType="svg"
									/>
									<LinterFormatterCard
										key="eslint-prettier"
										title={t("LinterFormatter.eslint-prettier.title")}
										name="eslint-prettier"
										description={t("LinterFormatter.eslint-prettier.description")}
										disableText={t("LinterFormatter.eslint-prettier.disableText")}
										iconType="png"
									/>
								</div>
							</ScrollArea>
						</aside>
					</div>

					<Button type="submit" className="mt-8 cursor-pointer">
						{t("GenerateButton")}
					</Button>
				</form>
			</Form>
		</section>
	);
}
