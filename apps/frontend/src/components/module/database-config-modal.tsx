"use client";

import { Database } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { getActiveOrmConfigs, type OrmConfig } from "@/constants/database";
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
	RadioGroupItem,
	Separator
} from "../ui";

interface Props {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

interface OrmSectionProps {
	config: OrmConfig;
	// biome-ignore lint/suspicious/noExplicitAny: <>
	control: any
	t: ReturnType<typeof useTranslations>;
}

function OrmDatabaseSection({ config, control, t }: OrmSectionProps) {
	return (
		<FormField
			control={control}
			name={`database.${config.fieldName}`}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="font-medium text-sm">
						{t("selectDatabase", { orm: config.displayName })}
					</FormLabel>
					<FormControl>
						<RadioGroup
							value={field.value || config.databases[0]?.value}
							onValueChange={field.onChange}
							className="grid grid-cols-1 gap-2"
						>
							{config.databases.map((option) => (
								<Label
									key={option.value}
									htmlFor={`${config.name}-db-${option.value}`}
									className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all hover:bg-accent ${
										field.value === option.value ? "border-primary bg-primary/5 text-primary" : "border-border"
									}`}
								>
									<RadioGroupItem
										className="sr-only"
										value={option.value}
										id={`${config.name}-db-${option.value}`}
									/>
									<Icon name={option.icon} iconType="svg" subfolder="database" className="size-5" />
									<span className="font-medium text-sm">{option.label}</span>
								</Label>
							))}
						</RadioGroup>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}

export function DatabaseConfigModal({ isOpen, onOpenChange }: Props) {
	const t = useTranslations("Generator.DatabaseConfig");
	const { control } = useFormContext();
	const { field: modulesField } = useController({ name: "modules", control });

	const activeOrmConfigs = useMemo(() => {
		return getActiveOrmConfigs(modulesField.value || []);
	}, [modulesField.value]);

	if (activeOrmConfigs.length === 0) return null;

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
					{activeOrmConfigs.map((config, index) => (
						<div key={config.name}>
							{index > 0 && <Separator className="my-4" />}
							<OrmDatabaseSection config={config} control={control} t={t} />
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

