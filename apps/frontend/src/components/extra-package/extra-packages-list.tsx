import type { SimpleNPMPackage } from "@/types/npm";
import { Package } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import { ExtraPackage } from ".";

export function ExtraPackagesList() {
	const { control } = useFormContext();
	const { field } = useController({
		name: "extraPackages",
		control
	});

	return (
		<div className="space-y-3">
			{field.value.length === 0 && (
				<div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-3 text-center">
					<div className="rounded-full bg-muted/50 p-4">
						<Package className="h-8 w-8 text-muted-foreground/60" />
					</div>
					<div className="space-y-1">
						<p className="font-medium text-muted-foreground text-sm">No extra packages selected</p>
						<p className="text-muted-foreground/70 text-xs">Click "Adicionar" to add npm packages</p>
					</div>
				</div>
			)}
			{(field.value as SimpleNPMPackage[]).map((pkg) => (
				<ExtraPackage.Card key={pkg.name} packageData={pkg} />
			))}
		</div>
	);
}
