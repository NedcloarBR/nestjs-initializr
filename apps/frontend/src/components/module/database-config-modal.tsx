"use client";

import { Database } from "lucide-react";
import { useTranslations } from "next-intl";
import { useController, useFormContext } from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Icon,
	Label,
	RadioGroup,
	RadioGroupItem
} from "../ui";

export type PrismaDbType = "postgres";

const prismaDbOptions: { value: PrismaDbType; label: string }[] = [{ value: "postgres", label: "PostgreSQL" }];

interface Props {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function DatabaseConfigModal({ isOpen, onOpenChange }: Props) {
	const t = useTranslations("Generator.DatabaseConfig");
	const { control } = useFormContext();
	const { field: modulesField } = useController({ name: "modules", control });

	const hasPrisma = modulesField.value?.includes("prisma-standalone");

	if (!hasPrisma) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Database className="h-5 w-5" />
						{t("title")}
					</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{hasPrisma && (
						<FormField
							control={control}
							name="database.prismaType"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-sm">{t("prisma.selectDatabase")}</FormLabel>
									<FormControl>
										<RadioGroup
											value={field.value || "postgres"}
											onValueChange={field.onChange}
											className="grid grid-cols-1 gap-2">
											{prismaDbOptions.map((option) => (
												<Label
													key={option.value}
													htmlFor={`prisma-db-${option.value}`}
													className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all hover:bg-accent ${
														field.value === option.value ? "border-primary bg-primary/5 text-primary" : "border-border"
													}`}>
													<RadioGroupItem className="sr-only" value={option.value} id={`prisma-db-${option.value}`} />
													<Icon name={option.value} iconType="svg" subfolder="database" className="size-5" />
													<span className="font-medium text-sm">{option.label}</span>
												</Label>
											))}
										</RadioGroup>
									</FormControl>
								</FormItem>
							)}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
