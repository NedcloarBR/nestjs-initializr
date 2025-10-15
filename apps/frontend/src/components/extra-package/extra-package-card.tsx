import { cn } from "@/lib/utils";
import type { NPMPackage, SimpleNPMPackage } from "@/types/npm";
import { ExternalLink, Package, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Switch } from "../ui";

interface Props {
	className?: string;
	packageData: SimpleNPMPackage | NPMPackage;
	inModal?: boolean;
}

export function ExtraPackageCard({ className, packageData, inModal }: Props) {
	const t = useTranslations("Generator.ExtraPackages");
	const { control } = useFormContext();
	const { field } = useController({
		name: "extraPackages",
		control
	});

	const isFullPackage = (pkg: SimpleNPMPackage | NPMPackage): pkg is NPMPackage =>
		(pkg as NPMPackage).package !== undefined;

	const name = isFullPackage(packageData) ? packageData.package.name : packageData.name;

	const version = isFullPackage(packageData) ? packageData.package.version : packageData.version;

	const description = isFullPackage(packageData) ? packageData.package.description : packageData.description;

	const npmLink = isFullPackage(packageData) ? packageData.package.links.npm : packageData.links?.npm;

	const alreadyAdded = (name: string) => {
		return (field.value as SimpleNPMPackage[]).some((pkg) => pkg.name === name);
	};

	const existingPackage = (field.value as SimpleNPMPackage[]).find((pkg) => pkg.name === name);

	const [dev, setDev] = useState(existingPackage?.dev ?? false);

	useEffect(() => {
		if (existingPackage) {
			setDev(existingPackage.dev ?? false);
		}
	}, [existingPackage]);

	const handleAddPackage = (dev: boolean) => {
		field.onChange([
			...field.value,
			{
				name,
				version,
				description,
				links: { npm: npmLink },
				dev
			}
		]);
	};

	const handleRemovePackage = () => {
		field.onChange(field.value.filter((pkg: SimpleNPMPackage) => pkg.name !== name));
	};

	const handleCheck = (checked: boolean) => {
		setDev(checked);

		if (alreadyAdded(name)) {
			const updatedPackages = (field.value as SimpleNPMPackage[]).map((pkg) =>
				pkg.name === name ? { ...pkg, dev: checked } : pkg
			);
			field.onChange(updatedPackages);
		}
	};

	return (
		<Card
			className={cn(
				className,
				"group hover:-translate-y-0.5 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
			)}>
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

			<CardHeader className="relative pb-3">
				<CardTitle className="flex items-center gap-2 text-base transition-colors group-hover:text-primary">
					<div className="rounded-lg bg-primary/10 p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
						<Package className="h-4 w-4" />
					</div>
					<span className="truncate">{name}</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="relative space-y-3 pb-3">
				<CardDescription className="line-clamp-2 text-xs leading-relaxed">{description}</CardDescription>

				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
							v{version}
						</span>
					</div>

					<div className="flex w-16 flex-col items-center gap-1">
						<Switch checked={dev} onCheckedChange={handleCheck} className="cursor-pointer" />
						<span className="text-center text-[10px] text-muted-foreground">
							{dev ? t("Dependency.dev") : t("Dependency.prod")}
						</span>
					</div>
				</div>
			</CardContent>

			<CardFooter className="relative flex-col gap-2 pt-0 sm:flex-row sm:justify-end">
				{inModal && !alreadyAdded(name) && (
					<Button
						className="w-full cursor-pointer sm:w-auto"
						variant="outline"
						size="sm"
						type="button"
						onClick={() => handleAddPackage(dev)}>
						<Plus className="mr-1.5 h-3.5 w-3.5" />
						{t("add")}
					</Button>
				)}

				{alreadyAdded(name) && (
					<Button
						className="w-full cursor-pointer sm:w-auto"
						variant="outline"
						size="sm"
						type="button"
						onClick={handleRemovePackage}>
						<Trash2 className="mr-1.5 h-3.5 w-3.5" />
						{t("remove")}
					</Button>
				)}

				{npmLink && (
					<Button asChild variant="ghost" size="sm" className="w-full cursor-pointer sm:w-auto">
						<a href={npmLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
							<ExternalLink className="h-3.5 w-3.5" />
							<span className="text-xs">{t("viewOnNPM")}</span>
						</a>
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
