import { useTranslations } from "next-intl";
import { Input } from "../ui";

interface Props {
	value: string | null;
	onChange: (value: string | null) => void;
}

export function ModuleTermFilter({ value, onChange }: Props) {
	const t = useTranslations("Generator.Filter");

	return (
		<Input
			value={value ?? ""}
			onChange={(e) => onChange(e.target.value ? e.target.value : null)}
			placeholder={t("searchByTerm")}
		/>
	);
}
