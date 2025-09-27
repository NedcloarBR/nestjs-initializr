import { useController, useFormContext } from "react-hook-form";
import {
	Card,
	CardDescription,
	CardFooter,
	CardTitle,
	FormControl,
	Icon,
	Separator,
	Switch,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "./ui";

interface Props {
	title: string;
	name: string;
	description: string;
	disableText?: string;
	iconType?: "svg" | "png";
}

export function LinterFormatterCard({ title, name, description, disableText, iconType }: Props) {
	const { control } = useFormContext();
	const { field } = useController({
		name: "linterFormatter",
		control
	});

	const isSelected = field.value === name;

	const disabled = field.value && field.value !== name;

	function toggleLinterFormatter() {
		const updatedLinterFormatter = isSelected ? "" : name;
		field.onChange(updatedLinterFormatter);
	}

	return (
		<Card className="flex h-64 w-80 max-w-80 flex-col justify-between p-4">
			<div>
				<CardTitle className="flex items-center justify-center gap-2">
					<Icon name={name} iconType={iconType ?? "svg"} subfolder="linterFormatter" className="size-8" />
					{title}
				</CardTitle>
				<Separator className="my-2" />
				<CardDescription>{description}</CardDescription>
			</div>

			<CardFooter className="flex items-center justify-center">
				<FormControl>
					<Tooltip>
						<TooltipTrigger asChild>
							<span>
								<Switch
									type="button"
									className="cursor-pointer"
									disabled={disabled}
									checked={isSelected}
									onCheckedChange={toggleLinterFormatter}
								/>
							</span>
						</TooltipTrigger>
						{disabled && <TooltipContent>{disableText}</TooltipContent>}
					</Tooltip>
				</FormControl>
			</CardFooter>
		</Card>
	);
}
