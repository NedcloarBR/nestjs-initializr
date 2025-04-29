import { useTranslations } from "next-intl";
import { useController, useFormContext } from "react-hook-form";
import { Card, CardDescription, CardFooter, CardTitle, FormControl, Separator, Switch } from "./ui";

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
		<Card className="flex h-64 w-80 max-w-80 flex-col justify-between p-4">
			<div>
				<CardTitle className="flex items-center justify-center gap-2">
					<img className="size-8" src="/icons/docker.svg" alt="Docker icon" />
					Docker
				</CardTitle>
				<Separator className="my-2" />
				<CardDescription>{t("description")}</CardDescription>
			</div>

			<CardFooter className="flex items-center justify-center">
				<FormControl>
					<Switch className="cursor-pointer" checked={isSelected} onCheckedChange={toggleDocker} />
				</FormControl>
			</CardFooter>
		</Card>
	);
}
