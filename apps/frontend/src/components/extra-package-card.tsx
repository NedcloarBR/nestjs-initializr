import { cn } from "@/lib/utils";
import type { NPMPackage, SimpleNPMPackage } from "@/types/npm";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Switch } from "./ui";

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
		<Card className={cn(className, "mb-3")}>
			<CardHeader>
				<CardTitle>{name}</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription>{description}</CardDescription>
				<div className="flex flex-col gap-4">
					<div className="flex min-w-0 flex-col gap-2">
						<span className="text-gray-500 text-xs">
							{t("version")} {version}
						</span>

						<span className="flex items-center gap-2 text-gray-500 text-xs">
							<Switch checked={dev} onCheckedChange={handleCheck} className="cursor-pointer" />
							<span className="whitespace-nowrap">{dev ? t("Dependency.dev") : t("Dependency.prod")}</span>
						</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
				{inModal && !alreadyAdded(name) && (
					<Button
						className="w-full cursor-pointer sm:w-auto"
						variant="outline"
						type="button"
						onClick={() => handleAddPackage(dev)}>
						{t("add")}
					</Button>
				)}

				{alreadyAdded(name) && (
					<Button
						className="w-full cursor-pointer sm:w-auto"
						variant="outline"
						type="button"
						onClick={handleRemovePackage}>
						{t("remove")}
					</Button>
				)}
				{npmLink && (
					<a
						href={npmLink}
						target="_blank"
						rel="noopener noreferrer"
						className="text-center text-blue-500 text-sm hover:underline">
						{t("viewOnNPM")}
					</a>
				)}
			</CardFooter>
		</Card>
	);
}
