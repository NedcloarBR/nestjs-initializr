import { modules } from "@/constants";
import { useTranslations } from "next-intl";
import { DockerCard } from "./docker-card";
import { LinterFormatterCard } from "./linter-formatter-card";
import { ModuleCard } from "./module-card";
import { TestRunnerCard } from "./test-runner-card";

export function ModulesList() {
	const t = useTranslations("Generator");

	return (
		<div className="flex flex-wrap justify-start gap-4">
			{[
				...modules(t).map((module) => ({
					component: (
						<ModuleCard
							key={module.name}
							title={module.title}
							name={module.name}
							description={module.description}
							iconType={module.iconType}
							dependsOn={module.dependsOn}
						/>
					),
					name: module.name
				})),
				{
					component: (
						<LinterFormatterCard
							key="biome"
							title={t("LinterFormatter.biome.title")}
							name="biome"
							description={t("LinterFormatter.biome.description")}
							disableText={t("LinterFormatter.biome.disableText")}
							iconType="svg"
						/>
					),
					name: "biome"
				},
				{
					component: (
						<LinterFormatterCard
							key="eslint-prettier"
							title={t("LinterFormatter.eslint-prettier.title")}
							name="eslint-prettier"
							description={t("LinterFormatter.eslint-prettier.description")}
							disableText={t("LinterFormatter.eslint-prettier.disableText")}
							iconType="png"
						/>
					),
					name: "eslint-prettier"
				},
				{
					component: (
						<TestRunnerCard
							key="jest"
							title={t("TestRunner.jest.title")}
							name="jest"
							description={t("TestRunner.jest.description")}
							disableText={t("TestRunner.jest.disableText")}
							iconType="svg"
						/>
					),
					name: "jest"
				},
				{
					component: (
						<TestRunnerCard
							key="vitest"
							title={t("TestRunner.vitest.title")}
							name="vitest"
							description={t("TestRunner.vitest.description")}
							disableText={t("TestRunner.vitest.disableText")}
							iconType="svg"
						/>
					),
					name: "vitest"
				},
				{
					component: <DockerCard key="docker" />,
					name: "docker"
				}
			]
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((item) => item.component)}
		</div>
	);
}
