import { DatabaseConfigModal } from "./database-config-modal";
import { DockerCard } from "./docker-card";
import { LinterFormatterCard } from "./linter-formatter-card";
import { ModuleCard } from "./module-card";
import { ModuleCategoryFilter } from "./module-category-filter";
import { ModulesList } from "./module-list";
import { ModuleTermFilter } from "./module-term-filter";
import { TestRunnerCard } from "./test-runner-card";

export const Module = {
	Card: ModuleCard,
	List: ModulesList,
	CategoryFilter: ModuleCategoryFilter,
	TermFilter: ModuleTermFilter,
	Docker: DockerCard,
	LinterFormatter: LinterFormatterCard,
	TestRunner: TestRunnerCard,
	DatabaseConfig: DatabaseConfigModal
};
