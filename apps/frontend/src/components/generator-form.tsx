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

const formSchemaFunction = (t: (arg: string) => string) =>
	z.object({
		projectName: z
			.string()
			.min(1, t("FormSchema.projectName.min"))
			.max(214, t("FormSchema.projectName.max"))
			.regex(/^(?:@[a-z0-9-*~][a-z0-9-._~]*\/)?[a-z0-9-*~][a-z0-9-._~]*$/, t("FormSchema.projectName.regex")),
		projectDescription: z.string().optional(),
		nodeVersion: z.string().default("20")
	});

export function GeneratorForm() {
	const t = useTranslations("Generator");
	const formSchema = formSchemaFunction(t);
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
					mainType: "fastify",
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
		<section id="generator-form" className="m-8 rounded-lg">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-8 p-8">
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

					<Button type="submit">{t("GenerateButton")}</Button>
				</form>
			</Form>
		</section>
	);
}
