import type { SimpleNPMPackage } from "@/types/npm";
import { useController, useFormContext } from "react-hook-form";
import { ExtraPackage } from ".";

export function ExtraPackagesList() {
	const { control } = useFormContext();
	const { field } = useController({
		name: "extraPackages",
		control
	});

	return (
		<div>
			{(field.value as SimpleNPMPackage[]).map((pkg) => (
				<ExtraPackage.Card key={pkg.name} packageData={pkg} />
			))}
		</div>
	);
}
