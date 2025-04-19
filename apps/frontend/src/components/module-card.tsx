import { useController, useFormContext } from "react-hook-form";
import { Card, CardDescription, CardFooter, CardTitle, FormControl, Separator, Switch } from "./ui";

interface Props {
	title: string;
	name: string;
	description: string;
}

export function ModuleCard({ title, name, description }: Props) {
	const { control } = useFormContext();
	const { field } = useController({
		name: "modules",
		control
	});

	const isSelected = field.value?.includes(name);

	function toggleModule() {
		const updatedModules = isSelected ? field.value.filter((mod: string) => mod !== name) : [...field.value, name];
		field.onChange(updatedModules);
	}

	return (
		<Card className="flex h-64 w-80 max-w-80 flex-col justify-between p-4">
			<div>
				<CardTitle className="flex items-center justify-center gap-2">
					<img className="size-8" src={`/icons/modules/${name}.svg`} alt={`${name} icon`} />
					{title}
				</CardTitle>
				<Separator className="my-2" />
				<CardDescription>{description}</CardDescription>
			</div>

			<CardFooter className="flex items-center justify-center">
				<FormControl>
					<Switch className="cursor-pointer" checked={isSelected} onCheckedChange={toggleModule} />
				</FormControl>
			</CardFooter>
		</Card>
	);
}
