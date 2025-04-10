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
	RadioGroupItem
} from "./ui";

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

	const nodeVersions = ["20", "21", "22", "23"];

	const modules = [{ name: "config", description: "@nestjs/config module but with a custom service", icon: "config" }];

	return (
		<section id="generator-form" className="m-8 rounded-lg">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-8 p-8">
					<div className="flex-1 space-y-8">
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

					<aside className="w-80 space-y-4">
						<h2 className="font-bold">{t("Modules.title")}</h2>
						{modules.map((module) => (
							<ModuleCard key={module.name} name={module.name} description={module.description} />
						))}
					</aside>

					<Button type="submit">{t("GenerateButton")}</Button>
				</form>
			</Form>
		</section>
	);
}
