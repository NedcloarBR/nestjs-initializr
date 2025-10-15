import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "../ui";

interface Props {
	value: string | null;
	onChange: (value: string | null) => void;
}

export function ModuleTermFilter({ value, onChange }: Props) {
	const t = useTranslations("Generator.Filter");

	return (
		<div className="relative flex-1">
			<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
			<Input
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value ? e.target.value : null)}
				placeholder={t("searchByTerm")}
				className="pl-9"
			/>
		</div>
	);
}
