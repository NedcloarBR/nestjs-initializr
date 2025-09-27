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

export function TestRunnerCard({ title, name, description, disableText, iconType }: Props) {
	const { control } = useFormContext();
	const { field } = useController({
		name: "testRunner",
		control
	});

	const isSelected = field.value === name;

	const disabled = field.value && field.value !== name;

	function toggleTestRunner() {
		const updatedTestRunner = isSelected ? "" : name;
		field.onChange(updatedTestRunner);
	}

	return (
		<Card className="flex h-64 w-80 max-w-80 flex-col justify-between p-4">
			<div>
				<CardTitle className="flex items-center justify-center gap-2">
					<Icon name={name} iconType={iconType ?? "svg"} subfolder="testRunner" className="size-8" />
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
									onCheckedChange={toggleTestRunner}
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
