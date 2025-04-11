"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Button,
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

import { modules, nodeVersions } from "@/constants";
import { saveAs } from "file-saver";
import { useTranslations } from "next-intl";
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
		nodeVersion: z.string().default("20"),
		modules: z.array(z.string()).optional().default([])
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
			modules: []
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
					modules: values.modules
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
			alert("Error downloading the zip file");
		}
	}

	return (
		<section id="generator-form" className="m-32 rounded-lg">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex">
						<div className="flex-1 space-y-8 bg-nest-header-background p-8 rounded-lg">
							<h2 className="font-bold">{t("Metadata.title")}</h2>

							<FormField
								name="projectName"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex items-center space-x-4 max-w-lg">
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
									<FormItem className="flex items-center space-x-4 max-w-lg">
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
									<FormItem className="flex items-center space-x-4 max-w-lg">
										<FormLabel className="w-20">{t("Metadata.nodeVersion")}</FormLabel>
										<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
											{nodeVersions.map((version) => (
												<div key={version} className="flex items-center">
													<FormControl>
														<Label
															htmlFor={version}
															className={`cursor-pointer ml-2 ${field.value === version ? "text-nest-primary" : ""}`}>
															<RadioGroupItem className="cursor-pointer custom-radio" value={version} id={version} />
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
									<FormItem className="flex items-center space-x-4 max-w-lg">
										<FormLabel className="w-20">{t("Metadata.mainType")}</FormLabel>
										<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
											<FormControl>
												<Label
													htmlFor="fastify"
													className={`cursor-pointer ml-2 ${field.value === "fastify" ? "text-nest-primary" : ""}`}>
													<RadioGroupItem className="cursor-pointer custom-radio" value="fastify" id="fastify" />
													Fastify
												</Label>
											</FormControl>
											<FormControl>
												<Label
													htmlFor="express"
													className={`cursor-pointer ml-2 ${field.value === "express" ? "text-nest-primary" : ""}`}>
													<RadioGroupItem className="cursor-pointer custom-radio" value="express" id="express" />
													Express
												</Label>
											</FormControl>
										</RadioGroup>
									</FormItem>
								)}
							/>
						</div>

						<div className="pr-16 pl-16">
							<Separator orientation="vertical" />
						</div>

						<aside className="space-y-8 overflow-hidden bg-nest-header-background p-8 rounded-lg">
							<h2 className="font-bold">{t("Modules.title")}</h2>
							<ScrollArea className="h-96">
								<div className="grid grid-cols-4 gap-4">
									{modules(t).map((module) => (
										<ModuleCard
											key={module.name}
											title={module.title}
											name={module.name}
											description={module.description}
										/>
									))}
								</div>
							</ScrollArea>
						</aside>
					</div>

					<Button type="submit" className="mt-8">
						{t("GenerateButton")}
					</Button>
				</form>
			</Form>
		</section>
	);
}
