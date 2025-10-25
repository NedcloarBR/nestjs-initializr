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
} from "../ui";

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
		<Card className="group hover:-translate-y-0.5 relative flex h-48 w-full flex-col justify-between overflow-hidden p-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
			<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

			<div className="relative">
				<CardTitle className="flex items-center justify-center gap-2 text-base transition-colors group-hover:text-primary">
					<div className="rounded-lg bg-primary/10 p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
						<Icon name={name} iconType={iconType ?? "svg"} subfolder="testRunner" className="size-6" />
					</div>
					{title}
				</CardTitle>
				<Separator className="my-1.5 transition-colors group-hover:bg-primary/20" />
				<CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
			</div>

			<CardFooter className="relative flex items-center justify-center p-0 pt-2">
				<FormControl>
					<Tooltip>
						<TooltipTrigger className="cursor-help" asChild>
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
