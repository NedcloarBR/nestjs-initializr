import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input,
	ScrollArea,
	Spinner
} from "@/components/ui";
import type { NPMPackage } from "@/types/npm";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ExtraPackage } from ".";

interface Props {
	packages: NPMPackage[];
	loading: boolean;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	fetchPackages: (packageName?: string) => void;
}

export function ExtraPackageModal({ packages, isOpen, onOpenChange, fetchPackages, loading }: Props) {
	const t = useTranslations("Generator.ExtraPackages");
	const [value, setValue] = useState<string | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchPackages(value || undefined);
		}, 300);

		return () => clearTimeout(timer);
	}, [value, fetchPackages]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Extra Package</DialogTitle>
					<DialogDescription>Select extra packages to include in your project.</DialogDescription>
					<Input
						value={value ?? ""}
						onChange={(e) => setValue(e.target.value ? e.target.value : null)}
						placeholder={t("search")}
					/>
				</DialogHeader>
				<ScrollArea className="h-80">
					{loading ? (
						<div className="flex h-80 w-full items-center justify-center">
							<Spinner className="size-10" />
						</div>
					) : (
						<>
							{packages.map((pkg) => (
								<ExtraPackage.Card className="w-110" key={pkg.package.name} packageData={pkg} inModal />
							))}
						</>
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
