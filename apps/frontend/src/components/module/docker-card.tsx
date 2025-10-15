import { useTranslations } from "next-intl";
import { useController, useFormContext } from "react-hook-form";
import { Card, CardDescription, CardFooter, CardTitle, FormControl, Icon, Separator, Switch } from "../ui";

export function DockerCard() {
	const t = useTranslations("Generator.Docker");
	const { control } = useFormContext();
	const { field } = useController({
		name: "docker",
		control
	});

	const isSelected = field.value;

	function toggleDocker() {
		field.onChange(!isSelected);
	}

	return (
		<Card className="group hover:-translate-y-0.5 relative flex h-48 w-full flex-col justify-between overflow-hidden p-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

			<div className="relative">
				<CardTitle className="flex items-center justify-center gap-2 text-base transition-colors group-hover:text-primary">
					<div className="rounded-lg bg-primary/10 p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
						<Icon name="docker" iconType={"svg"} className="size-6" />
					</div>
					Docker
				</CardTitle>
				<Separator className="my-1.5 transition-colors group-hover:bg-primary/20" />
				<CardDescription className="text-xs leading-relaxed">{t("description")}</CardDescription>
			</div>

			<CardFooter className="relative flex items-center justify-center p-0 pt-2">
				<FormControl>
					<Switch className="cursor-pointer" checked={isSelected} onCheckedChange={toggleDocker} />
				</FormControl>
			</CardFooter>
		</Card>
	);
}
