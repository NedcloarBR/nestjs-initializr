"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Bug, PackagePlus, RefreshCcw, Rocket, Save, Settings2, Sparkles, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { generate, loadConfig } from "@/actions";
import { getDebugSession } from "@/actions/debug";
import { extraFields, nodeVersions, packageManagers } from "@/constants";
import { databaseModules } from "@/constants/modules";
import { generatorFormSchema } from "@/forms/generator-form-schema";
import { useExtraPackages } from "@/hooks/use-extra-packages";
import type { ConfigStructure } from "@/types/config";
import type { GeneratorFormDataType } from "@/types/form";
import type { ModuleCategory } from "@/types/module";
import { DebugModal } from "./debug/debug-modal";
import { ExtraField } from "./extra-field";
import { ExtraPackage } from "./extra-package";
import { Module } from "./module";
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

function configToFormData(data: ConfigStructure) {
	return {
		mainType: data.mainType,
		projectName: data.packageJson.name,
		projectDescription: data.packageJson.description,
		nodeVersion: data.packageJson.nodeVersion,
		packageManager: data.packageManager,
		modules: data.modules,
		extras: data.extras,
		linterFormatter: data.linterFormatter,
		docker: data.docker,
		testRunner: data.testRunner,
		extraPackages: data.extraPackages,
		database: {
			prismaType: "postgres" as const
		}
	};
}

export function GeneratorForm() {
	const debugEnabled = process.env.NEXT_PUBLIC_DEBUG_ENABLED === "true";

	const t = useTranslations("Generator");
	const formSchema = generatorFormSchema(t);
	const defaultValues: GeneratorFormDataType = {
		projectName: t("FormSchema.projectName.default"),
		projectDescription: t("FormSchema.projectDescription.default"),
		nodeVersion: "20",
		mainType: "fastify",
		packageManager: "npm",
		modules: [],
		extras: [],
		linterFormatter: null,
		docker: false,
		testRunner: null,
		extraPackages: [],
		database: { prismaType: "postgres" }
	};
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues
	});

	const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | null>(null);

	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	const [isOpenExtraPackageModal, setIsOpenExtraPackageModal] = useState(false);
	const [isOpenDatabaseConfigModal, setIsOpenDatabaseConfigModal] = useState(false);
	const [previousModules, setPreviousModules] = useState<string[]>(defaultValues.modules);
	const { packages, fetchPackages, loading: packagesLoading } = useExtraPackages();
	const [debugId, setDebugId] = useState<string | null>(null);
	const [debugIsOpen, setDebugIsOpen] = useState(false);
	const [dataToDebug, setDataToDebug] = useState<GeneratorFormDataType>(defaultValues);
	const modules = form.watch("modules");

	useEffect(() => {
		if (isOpenExtraPackageModal && packages.length === 0) {
			fetchPackages();
		}
	}, [isOpenExtraPackageModal, packages.length, fetchPackages]);

	useEffect(() => {
		const databaseModuleAdded =
			modules?.some((mod) => databaseModules.includes(mod as (typeof databaseModules)[number])) &&
			!previousModules?.some((mod) => databaseModules.includes(mod as (typeof databaseModules)[number]));

		if (databaseModuleAdded) {
			setIsOpenDatabaseConfigModal(true);
		}

		setPreviousModules(modules ?? []);
	}, [modules, previousModules]);

	function clearFilters() {
		setSelectedCategory(null);
		setSearchTerm(null);
	}

	function handleConfig(event: ChangeEvent<HTMLInputElement>) {
		loadConfig(event, t, (data) => {
			form.reset(configToFormData(data));
		});
	}

	function handleReset() {
		form.reset(defaultValues);
		const fileInput = document.getElementById("fileUpload") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	}

	async function getDebugId(values: z.infer<ReturnType<typeof generatorFormSchema>>) {
		setDataToDebug(values);
		const debugId = await getDebugSession();

		if (!debugId) return;

		setDebugId(debugId);
		setDebugIsOpen(true);
	}

	return (
		<section id="generator-form" className="container mx-auto px-3 py-6 md:px-4 lg:px-6">
			<Form {...form}>
				<form className="space-y-6">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
						{/* Metadata */}
						<div className="lg:col-span-4">
							<div className="flex h-[700px] flex-col space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
								<div className="space-y-1">
									<h2 className="font-semibold text-xl tracking-tight">{t("Metadata.title")}</h2>
									<p className="text-muted-foreground text-sm">{t("Metadata.meta_description")}</p>
								</div>

								<div className="h-[580px] rounded-lg border border-border/50 bg-muted/50 p-3">
									<div className="space-y-4 pr-4">
										<FormField
											name="projectName"
											control={form.control}
											render={({ field }) => (
												<FormItem className="space-y-2">
													<FormLabel className="font-medium text-sm">{t("Metadata.name")}</FormLabel>
													<FormControl>
														<Input {...field} className="w-full" placeholder="@organization/project-name" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											name="projectDescription"
											control={form.control}
											render={({ field }) => (
												<FormItem className="space-y-2">
													<FormLabel className="font-medium text-sm">{t("Metadata.description")}</FormLabel>
													<FormControl>
														<Input {...field} className="w-full" placeholder="Project description" />
													</FormControl>
												</FormItem>
											)}
										/>

										<FormField
											name="nodeVersion"
											control={form.control}
											render={({ field }) => (
												<FormItem className="space-y-2">
													<FormLabel className="font-medium text-sm">{t("Metadata.nodeVersion")}</FormLabel>
													<RadioGroup
														onValueChange={field.onChange}
														value={field.value}
														className="flex flex-wrap gap-2">
														{nodeVersions.map((version) => (
															<div key={version} className="flex items-center">
																<FormControl>
																	<Label
																		htmlFor={version}
																		className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 transition-all hover:bg-accent ${
																			field.value === version
																				? "border-primary bg-primary/5 text-primary"
																				: "border-border"
																		}`}>
																		<RadioGroupItem className="sr-only" value={version} id={version} />
																		<span className="font-medium text-sm">{version}</span>
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
												<FormItem className="space-y-2">
													<FormLabel className="font-medium text-sm">{t("Metadata.mainType")}</FormLabel>
													<RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-2">
														<FormControl>
															<Label
																htmlFor="fastify"
																className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-all hover:bg-accent ${
																	field.value === "fastify"
																		? "border-primary bg-primary/5 text-primary"
																		: "border-border"
																}`}>
																<RadioGroupItem className="sr-only" value="fastify" id="fastify" />
																<span className="font-medium text-sm">Fastify</span>
															</Label>
														</FormControl>
														<FormControl>
															<Label
																htmlFor="express"
																className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-all hover:bg-accent ${
																	field.value === "express"
																		? "border-primary bg-primary/5 text-primary"
																		: "border-border"
																}`}>
																<RadioGroupItem className="sr-only" value="express" id="express" />
																<span className="font-medium text-sm">Express</span>
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
												<FormItem className="space-y-2">
													<FormLabel className="font-medium text-sm">{t("Metadata.packageManager")}</FormLabel>
													<RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-2">
														{packageManagers.map((manager) => (
															<FormControl key={manager}>
																<Label
																	htmlFor={manager}
																	className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border p-2 transition-all hover:bg-accent ${
																		field.value === manager ? "border-primary bg-primary/5" : "border-border"
																	}`}>
																	<RadioGroupItem className="sr-only" value={manager} id={manager} />
																	{/** biome-ignore lint/performance/noImgElement: <> */}
																	<img
																		src={`/icons/packageManagers/${manager}.svg`}
																		alt={`${manager} icon`}
																		className="h-5 w-5"
																	/>
																</Label>
															</FormControl>
														))}
													</RadioGroup>
												</FormItem>
											)}
										/>

										<Separator />

										<div className="flex flex-wrap gap-2">
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
														<Settings2 className="mr-1.5 h-4 w-4" />
														{t("Extra.trigger")}
													</Button>
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
												<TooltipTrigger className="cursor-help" asChild>
													<Button
														type="button"
														variant="outline"
														size="sm"
														className="cursor-pointer bg-transparent"
														onClick={() => document.getElementById("fileUpload")?.click()}>
														<Upload className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>{t("ActionsTooltip.loadConfig")}</TooltipContent>
												<Input className="hidden" id="fileUpload" type="file" accept=".json" onChange={handleConfig} />
											</Tooltip>

											<Tooltip>
												<TooltipTrigger className="cursor-help" asChild>
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={handleReset}
														className="cursor-pointer bg-transparent">
														<RefreshCcw className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>{t("ActionsTooltip.resetConfig")}</TooltipContent>
											</Tooltip>

											<RecentHistory loadData={(data) => form.reset(configToFormData(data))} />
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Modules */}
						<div className="lg:col-span-5">
							<div className="flex h-[700px] flex-col space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div className="space-y-1">
										<h2 className="font-semibold text-xl tracking-tight">{t("Modules.title")}</h2>
										<p className="text-muted-foreground text-sm">{t("Modules.description")}</p>
									</div>
								</div>

								<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
									<Module.TermFilter value={searchTerm} onChange={setSearchTerm} />
									<Module.CategoryFilter value={selectedCategory} onSelect={setSelectedCategory} />
									{(selectedCategory || searchTerm) && (
										<Button
											variant="outline"
											size="sm"
											className="cursor-pointer bg-transparent"
											type="button"
											onClick={() => clearFilters()}>
											<Sparkles className="mr-1.5 h-4 w-4" />
											{t("Filter.clearFilter")}
										</Button>
									)}
								</div>

								<div className="flex-1 overflow-hidden rounded-lg border border-border/50 bg-muted/50 p-4">
									<ScrollArea className="h-full">
										<div className="pr-4">
											<Module.List category={selectedCategory} term={searchTerm} />
										</div>
									</ScrollArea>
								</div>
							</div>
						</div>

						{/* Extra Packages */}
						<div className="lg:col-span-3">
							<div className="flex h-[700px] flex-col space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
								<div className="flex items-center justify-between">
									<div className="space-y-1">
										<h2 className="font-semibold text-xl tracking-tight">{t("ExtraPackages.title")}</h2>
										<p className="text-muted-foreground text-sm">{t("ExtraPackages.description")}</p>
									</div>
								</div>

								<Button
									variant="outline"
									size="sm"
									className="w-full cursor-pointer bg-transparent"
									type="button"
									onClick={() => setIsOpenExtraPackageModal((prev) => !prev)}>
									<PackagePlus className="mr-1.5 h-4 w-4" />
									{t("ExtraPackages.add")}
								</Button>

								<div className="flex-1 overflow-hidden rounded-lg border border-border/50 bg-muted/50 p-3">
									<ScrollArea className="h-full">
										<div>
											<ExtraPackage.List />
										</div>
									</ScrollArea>
								</div>
							</div>
						</div>
					</div>

					{/* Modals */}
					<ExtraPackage.Modal
						packages={packages}
						loading={packagesLoading}
						isOpen={isOpenExtraPackageModal}
						onOpenChange={() => setIsOpenExtraPackageModal((prev) => !prev)}
						fetchPackages={fetchPackages}
					/>

					<DebugModal
						debugId={debugId ?? ""}
						isOpen={debugIsOpen}
						onOpenChange={() => setDebugIsOpen((prev) => !prev)}
						dataToDebug={dataToDebug}
					/>

					<Module.DatabaseConfig isOpen={isOpenDatabaseConfigModal} onOpenChange={setIsOpenDatabaseConfigModal} />

					{/* Submit */}
					<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
						<div className="flex flex-col items-center justify-center space-y-2">
							<div className="space-y-2 text-center">
								<h2 className="font-semibold text-2xl tracking-tight">{t("Submit.title")}</h2>
								<p className="text-muted-foreground text-sm">{t("Submit.description")}</p>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row">
								<Button
									onClick={form.handleSubmit((values) => generate(values, "project"))}
									variant="outline"
									className="cursor-pointer"
									size="lg">
									<Rocket className="mr-2 h-5 w-5" />
									{t("Submit.project")}
								</Button>
								<Button
									onClick={form.handleSubmit((values) => generate(values, "config"))}
									variant="outline"
									className="cursor-pointer"
									size="lg">
									<Save className="mr-2 h-5 w-5" />
									{t("Submit.config")}
								</Button>
							</div>
							{debugEnabled && (
								<Button
									onClick={form.handleSubmit((values) => getDebugId(values))}
									variant="outline"
									className="cursor-pointer"
									size="lg">
									<Bug className="mr-2 h-5 w-5" />
									Debug
								</Button>
							)}
						</div>
					</div>
				</form>
			</Form>
		</section>
	);
}
