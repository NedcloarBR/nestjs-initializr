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
	RadioGroup,
	RadioGroupItem
} from "./ui";

import { saveAs } from "file-saver";
import { useTranslations } from "next-intl";

const formSchema = z.object({
	projectName: z
		.string()
		.min(1, "Project name is required")
		.max(214, "Project name must be less than 214 characters")
		.regex(/^(?:@[a-z0-9-*~][a-z0-9-._~]*\/)?[a-z0-9-*~][a-z0-9-._~]*$/, "Invalid project name"),
	projectDescription: z.string().optional(),
	nodeVersion: z.string().min(1, "Node version is required").default("20").optional()
});

export function GeneratorForm() {
	const t = useTranslations("Generator");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nodeVersion: "20"
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
					name: values.projectName,
					description: values.projectDescription,
					nodeVersion: values.nodeVersion
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

	return (
		<section id="generator-form" className="m-8 h-full bg-zinc-800 rounded-lg">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-xs p-8">
					<h2>{t("Metadata.title")}</h2>

					<FormField
						name="projectName"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center space-x-4">
									<FormLabel>{t("Metadata.name")}</FormLabel>
									<FormControl className="flex-1">
										<Input {...field} />
									</FormControl>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="projectDescription"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex items-center space-x-4">
								<FormLabel>{t("Metadata.description")}</FormLabel>
								<FormControl className="flex-1">
									<Input {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						name="nodeVersion"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex flex-row items-center space-x-4">
								<FormLabel className="whitespace-nowrap">{t("Metadata.nodeVersion")}</FormLabel>
								<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex">
									{nodeVersions.map((version) => (
										<FormItem key={version} className="flex items-center space-x-3">
											<FormControl className="flex-1">
												<RadioGroupItem value={version} id={version} />
											</FormControl>
											<FormLabel>{version}</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormItem>
						)}
					/>
					<Button type="submit">{t("GenerateButton")}</Button>
				</form>
			</Form>
		</section>
	);
}
