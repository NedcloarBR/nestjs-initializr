import { useController, useFormContext } from "react-hook-form";
import { FormControl } from "./ui";
import { Card, CardDescription, CardFooter, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";

interface Props {
	name: string;
	description: string;
}

export function ModuleCard({ name, description }: Props) {
	const { control } = useFormContext();
	const { field } = useController({
		name: "modules",
		control
	});

	const isSelected = field.value?.includes(name);

	function toggleModule() {
		const updatedModules = isSelected ? field.value.filter((mod: string) => mod !== name) : [...field.value, name];
		field.onChange(updatedModules);
		console.log(updatedModules);
	}

	return (
		<Card className="w-80">
			<CardTitle>
				{name}
				<img src={`/icons/modules/${name}.png`} alt={`${name} icon`} />
			</CardTitle>
			<CardDescription>{description}</CardDescription>
			<CardFooter>
				<FormControl>
					<Switch checked={isSelected} onCheckedChange={toggleModule} />
				</FormControl>
			</CardFooter>
		</Card>
	);
}
