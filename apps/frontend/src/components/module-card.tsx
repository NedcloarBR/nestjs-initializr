import { dockerRequiredModules, moduleDependencies } from "@/constants/modules";
import { useTranslations } from "next-intl";
import { useController, useFormContext } from "react-hook-form";
import {
	Card,
	CardDescription,
	CardFooter,
	CardTitle,
	FormControl,
	ScrollArea,
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
	iconType: "svg" | "png";
	dependsOn?: string | string[];
}

export function ModuleCard({ title, name, description, dependsOn, iconType }: Props) {
	const t = useTranslations("Generator.Modules");
	const { control } = useFormContext();
	const { field } = useController({
		name: "modules",
		control
	});

	const { field: dockerField } = useController({
		name: "docker"
	});

	const dockerIsMissing = dockerRequiredModules.includes(name) && !dockerField.value;

	const isSelected = field.value?.includes(name);

	const isDisabledModules = dependsOn
		? Array.isArray(dependsOn)
			? !dependsOn.every((dep) => field.value?.includes(dep))
			: !field.value?.includes(dependsOn)
		: false;

	const isDisabled = isDisabledModules || dockerIsMissing;

	function findDependents(moduleName: string, currentModules: string[]): string[] {
		const dependents: Set<string> = new Set();

		function find(module: string) {
			for (const [mod, dependencies] of Object.entries(moduleDependencies)) {
				if (dependencies.includes(module) && currentModules.includes(mod)) {
					dependents.add(mod);
					find(mod);
				}
			}
		}

		find(moduleName);

		return Array.from(dependents);
	}

	function toggleModule() {
		let updatedModules: string[] = [];

		if (isSelected) {
			updatedModules = field.value.filter((mod: string) => mod !== name);

			const toRemove = findDependents(name, updatedModules);

			updatedModules = updatedModules.filter((mod) => !toRemove.includes(mod));
		} else {
			updatedModules = [...field.value, name];
		}

		field.onChange(updatedModules);
	}

	return (
		<Card className="flex h-64 w-80 max-w-80 flex-col justify-between p-4">
			<div className="flex flex-col gap-2 overflow-hidden">
				<CardTitle className="flex items-center justify-center gap-2">
					<img className="size-8" src={`/icons/modules/${name}.${iconType}`} alt={`${name} icon`} />
					{title}
				</CardTitle>
				<Separator />
				<ScrollArea className="h-28 pr-2">
					<CardDescription className="text-sm">{description}</CardDescription>
				</ScrollArea>
			</div>

			<CardFooter className="flex items-center justify-center">
				<FormControl>
					<Tooltip>
						<TooltipTrigger asChild>
							<span>
								<Switch
									className="cursor-pointer"
									checked={isSelected}
									disabled={isDisabled}
									onCheckedChange={toggleModule}
								/>
							</span>
						</TooltipTrigger>
						{isDisabled && (
							<TooltipContent>
								{dockerIsMissing
									? t("dockerMissing")
									: t("dependsOn", { ModuleNames: Array.isArray(dependsOn) ? dependsOn.join(", ") : dependsOn })}
							</TooltipContent>
						)}
					</Tooltip>
				</FormControl>
			</CardFooter>
		</Card>
	);
}
