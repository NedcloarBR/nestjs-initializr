import { ModuleCategory } from "@/types/module";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui";

interface Props {
	value: ModuleCategory | null;
	onSelect: (category: ModuleCategory | null) => void;
}

export function ModuleCategoryFilter({ value, onSelect }: Props) {
	const t = useTranslations("Generator.Filter");

	return (
		<Select value={value ?? ""} onValueChange={(val) => onSelect(val ? (val as ModuleCategory) : null)}>
			<SelectTrigger>
				<SelectValue placeholder={t("selectCategory")} />
			</SelectTrigger>
			<SelectContent>
				{Object.values(ModuleCategory).map((value) => (
					<SelectItem key={value} value={value}>
						{t(`categories.${value}`)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
