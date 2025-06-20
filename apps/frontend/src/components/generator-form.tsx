"use client";

import { generate, loadConfig } from "@/actions";
import { extraFields, nodeVersions, packageManagers } from "@/constants";
import { generatorFormSchema } from "@/forms/generator-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcwIcon, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ExtraField } from "./extra-field";
import { ModulesList } from "./modules-list";
import { RecentHistory } from "./recent-history";
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
	Separator,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "./ui";

export function GeneratorForm() {
	const t = useTranslations("Generator");
	const formSchema = generatorFormSchema(t);
	const defaultValues: z.infer<typeof formSchema> = {
		projectName: t("FormSchema.projectName.default"),
		projectDescription: t("FormSchema.projectDescription.default"),
		nodeVersion: "20",
		mainType: "fastify",
		packageManager: "npm",
		modules: [],
		extras: [],
		linterFormatter: null,
		docker: false,
		testRunner: null
	};
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues
	});

	function handleConfig(event: React.ChangeEvent<HTMLInputElement>) {
		loadConfig(event, (data) => {
			form.reset(data);
		});
	}

	function handleReset() {
		form.reset(defaultValues);
		const fileInput = document.getElementById("fileUpload") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	}

	return (
		<section id="generator-form" className="m-16">
			<Form {...form}>
				<form>
					<div className="flex">
						<div className="w-1/3 space-y-8 rounded-lg bg-nest-header-background p-8">
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
										<RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
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
										<RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
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
										<RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-12">
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

							<div className="flex max-w-xl items-center space-x-4">
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

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											type="button"
											className="cursor-pointer"
											onClick={() => document.getElementById("fileUpload")?.click()}>
											<UploadIcon />
										</Button>
									</TooltipTrigger>
									<TooltipContent>{t("ActionsTooltip.loadConfig")}</TooltipContent>
									<Input className="hidden" id="fileUpload" type="file" accept=".json" onChange={handleConfig} />
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button type="button" onClick={handleReset} className="cursor-pointer">
											<RefreshCcwIcon />
										</Button>
									</TooltipTrigger>
									<TooltipContent>{t("ActionsTooltip.resetConfig")}</TooltipContent>
								</Tooltip>

								<RecentHistory />
							</div>
						</div>

						<div className="pr-8 pl-8">
							<Separator orientation="vertical" />
						</div>

						<aside className="w-2/3 space-y-8 overflow-hidden rounded-lg bg-nest-header-background p-8">
							<h2 className="font-bold">{t("Modules.title")}</h2>
							<ScrollArea className="h-96">
								<ModulesList />
							</ScrollArea>
						</aside>
					</div>

					<Separator className="my-8" />

					<div className="flex flex-col items-center justify-center rounded-lg bg-nest-header-background">
						<h2 className="mt-4 font-bold">{t("Submit.title")}</h2>
						<div className="m-4 flex space-x-4">
							<Button onClick={form.handleSubmit((values) => generate(values, "project"))} className="cursor-pointer">
								{t("Submit.project")}
							</Button>
							<Button onClick={form.handleSubmit((values) => generate(values, "config"))} className="cursor-pointer">
								{t("Submit.config")}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</section>
	);
}
