import { modules } from "@/constants";
import { ModuleCategory } from "@/types/module";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { DockerCard } from "./docker-card";
import { LinterFormatterCard } from "./linter-formatter-card";
import { ModuleCard } from "./module-card";
import { TestRunnerCard } from "./test-runner-card";

interface Props {
	category: ModuleCategory | null;
	term: string | null;
}

export function ModulesList({ category, term }: Props) {
	const t = useTranslations("Generator");

	const allModules = useMemo(() => {
		return [
			...modules(t).map((module) => ({
				name: module.name,
				category: module.category,
				type: "module" as const,
				data: module
			})),
			{
				name: "biome",
				category: ModuleCategory.LINTER_FORMATTER,
				type: "linter" as const,
				data: {
					title: t("LinterFormatter.biome.title"),
					description: t("LinterFormatter.biome.description"),
					disableText: t("LinterFormatter.biome.disableText"),
					iconType: "svg" as const
				}
			},
			{
				name: "eslint-prettier",
				category: ModuleCategory.LINTER_FORMATTER,
				type: "linter" as const,
				data: {
					title: t("LinterFormatter.eslint-prettier.title"),
					description: t("LinterFormatter.eslint-prettier.description"),
					disableText: t("LinterFormatter.eslint-prettier.disableText"),
					iconType: "png" as const
				}
			},
			{
				name: "jest",
				category: ModuleCategory.TEST_RUNNER,
				type: "test" as const,
				data: {
					title: t("TestRunner.jest.title"),
					description: t("TestRunner.jest.description"),
					disableText: t("TestRunner.jest.disableText"),
					iconType: "svg" as const
				}
			},
			{
				name: "vitest",
				category: ModuleCategory.TEST_RUNNER,
				type: "test" as const,
				data: {
					title: t("TestRunner.vitest.title"),
					description: t("TestRunner.vitest.description"),
					disableText: t("TestRunner.vitest.disableText"),
					iconType: "svg" as const
				}
			},
			{
				name: "docker",
				category: ModuleCategory.INFRA,
				type: "docker" as const,
				data: {
					title: "Docker",
					description: t("Docker.description")
				}
			}
		].sort((a, b) => a.name.localeCompare(b.name));
	}, [t]);

	const filteredModules = useMemo(() => {
		return allModules
			.filter((item) => (category ? item.category === category : true))
			.filter((item) =>
				term
					? item.name.toLowerCase().includes(term.toLowerCase()) ||
						item.data?.title.toLowerCase().includes(term.toLowerCase()) ||
						item.data?.description.toLowerCase().includes(term.toLowerCase())
					: true
			);
	}, [allModules, category, term]);

	return (
		<div className="flex flex-wrap justify-start gap-4">
			{filteredModules.map((item) => {
				switch (item.type) {
					case "module":
						return (
							<ModuleCard
								key={item.name}
								title={item.data.title}
								name={item.name}
								description={item.data.description}
								iconType={item.data.iconType}
								dependsOn={item.data.dependsOn}
							/>
						);
					case "linter":
						return (
							<LinterFormatterCard
								key={item.name}
								title={item.data?.title}
								name={item.name}
								description={item.data.description}
								disableText={item.data.disableText}
								iconType={item.data.iconType}
							/>
						);
					case "test":
						return (
							<TestRunnerCard
								key={item.name}
								title={item.data?.title}
								name={item.name}
								description={item.data?.description}
								disableText={item.data?.disableText}
								iconType={item.data.iconType}
							/>
						);
					case "docker":
						return <DockerCard key="docker" />;
				}
			})}
		</div>
	);
}
