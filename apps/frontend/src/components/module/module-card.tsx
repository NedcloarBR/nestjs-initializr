import {
	type ModuleName,
	dockerRequiredModules,
	linterFormatterRequiredModules,
	moduleDependencies
} from "@/constants/modules";
import { useTranslations } from "next-intl";
import { useController, useFormContext } from "react-hook-form";
import {
	Card,
	CardDescription,
	CardFooter,
	CardTitle,
	FormControl,
	Icon,
	ScrollArea,
	Separator,
	Switch,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "../ui";

interface Props {
	title: string;
	name: ModuleName;
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

	const { field: linterFormatterField } = useController({
		name: "linterFormatter"
	});

	const dockerIsMissing = dockerRequiredModules.includes(name) && !dockerField.value;

	const anotherLinterFormatterEnabled = linterFormatterRequiredModules.includes(name) && !linterFormatterField.value;

	const isSelected = field.value?.includes(name);

	const isDisabledModules = dependsOn
		? Array.isArray(dependsOn)
			? !dependsOn.every((dep) => field.value?.includes(dep))
			: !field.value?.includes(dependsOn)
		: false;

	const isDisabled = isDisabledModules || dockerIsMissing || anotherLinterFormatterEnabled;

	function findDependents(moduleName: ModuleName, currentModules: string[]): string[] {
		const dependents: Set<string> = new Set();

		function find(module: ModuleName) {
			for (const [mod, dependencies] of Object.entries(moduleDependencies)) {
				if (dependencies.includes(module) && currentModules.includes(mod)) {
					dependents.add(mod);
					find(mod as ModuleName);
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

	function getTooltipMessage() {
		const missingMessages: string[] = [];

		if (dockerIsMissing) missingMessages.push(t("dockerMissing"));
		if (anotherLinterFormatterEnabled) missingMessages.push(t("anotherLinterFormatterEnabled"));

		const hasDepends = Boolean(dependsOn && (Array.isArray(dependsOn) ? dependsOn.length : true));

		if (hasDepends) {
			const ModuleNames = Array.isArray(dependsOn) ? dependsOn.join(", ") : (dependsOn ?? "");
			missingMessages.push(t("dependsOn", { ModuleNames }));
		}

		// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
		return missingMessages.length > 0 ? missingMessages.map((msg, i) => <div key={i}>{msg}</div>) : null;
	}

	return (
		<Card className="group hover:-translate-y-0.5 relative flex h-48 w-full flex-col justify-between overflow-hidden p-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

			<div className="relative flex flex-col gap-1.5 overflow-hidden">
				<CardTitle className="flex items-center justify-center gap-2 text-base transition-colors group-hover:text-primary">
					<div className="rounded-lg bg-primary/10 p-1.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
						<Icon name={name} iconType={iconType} subfolder="modules" className="size-6" />
					</div>
					{title}
				</CardTitle>
				<Separator className="transition-colors group-hover:bg-primary/20" />
				<ScrollArea className="h-20 pr-2">
					<CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
				</ScrollArea>
			</div>

			<CardFooter className="relative flex items-center justify-center p-0 pt-2">
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
						{isDisabled && <TooltipContent>{getTooltipMessage()}</TooltipContent>}
					</Tooltip>
				</FormControl>
			</CardFooter>
		</Card>
	);
}
