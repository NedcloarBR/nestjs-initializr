import { Info } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";
import { FormControl, Label, Switch } from "./ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
	name: string;
	title: string;
	description: string;
}

export function ExtraField({ name, title, description }: Props) {
	const { control } = useFormContext();
	const { field } = useController({
		name: "extras",
		control
	});

	const isSelected = field.value?.includes(name);

	function toggleExtra() {
		const updatedExtras = isSelected ? field.value.filter((extra: string) => extra !== name) : [...field.value, name];
		field.onChange(updatedExtras);
	}

	return (
		<Label htmlFor={name} className="ml-2 pt-2">
			<FormControl>
				<Switch className="cursor-pointer" checked={isSelected} onCheckedChange={toggleExtra} />
			</FormControl>
			{title}
			<Tooltip>
				<TooltipTrigger className="cursor-help">
					<Info className="size-4" />
				</TooltipTrigger>
				<TooltipContent>
					<p>{description}</p>
				</TooltipContent>
			</Tooltip>
		</Label>
	);
}
