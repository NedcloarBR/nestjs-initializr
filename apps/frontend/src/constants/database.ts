import type { ModuleName } from "./modules";

export type DatabaseType = "postgres" | "mysql" | "sqlite" | "mongodb" | "sqlserver";

export interface DatabaseOption {
	value: DatabaseType;
	label: string;
	icon: string;
}

export interface OrmConfig {
	name: string;
	displayName: string;
	modules: ModuleName[];
	fieldName: string;
	databases: DatabaseOption[];
}

export const ormConfigs: OrmConfig[] = [
	{
		name: "prisma",
		displayName: "Prisma",
		modules: ["prisma-standalone", "nestjs-prisma"],
		fieldName: "prismaType",
		databases: [
			{ value: "postgres", label: "PostgreSQL", icon: "postgres" }
		]
  }
];

export function getOrmConfigByModule(moduleName: string): OrmConfig | undefined {
	return ormConfigs.find((config) => config.modules.includes(moduleName as ModuleName));
}

export function getActiveOrmConfigs(selectedModules: string[]): OrmConfig[] {
	return ormConfigs.filter((config) => config.modules.some((mod) => selectedModules.includes(mod)));
}
