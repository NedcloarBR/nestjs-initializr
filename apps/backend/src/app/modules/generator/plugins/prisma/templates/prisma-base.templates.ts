export function PrismaBaseTemplates(type: string) {
	const databaseProviders: Record<string, string> = {
		postgres: "postgresql://postgres:password@localhost:5432/mydb"
	};

	function addDatabaseEnvVars(type: string): string {
		switch (type) {
			case "postgres":
				return `
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=mydb
`;
		}
	}

	function addDockerCompose(type: string): string {
		switch (type) {
			case "postgres":
				return `
  postgresql:
    image: bitnami/postgresql:latest
    container_name: postgres
    ports:
      - "\${POSTGRES_PORT}:5432"
    environment:
      - POSTGRESQL_USERNAME=\${POSTGRES_USERNAME}
      - POSTGRESQL_PASSWORD=\${POSTGRES_PASSWORD}
      - POSTGRESQL_DATABASE=\${POSTGRES_DATABASE}
        `;
		}
	}
	return {
		prismaConfig: {
			name: "prisma.config.ts",
			path: "",
			content: `
import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
})

  `.trim()
		},
		prismaSchema: {
			name: "schema.prisma",
			path: "prisma",
			content: `
generator client {
  provider        = "prisma-client"
  output          = "../src/generated/prisma"
  moduleFormat    = "cjs"
}

datasource db {
  provider = "postgresql"
}
  `.trim()
		},
		dotenv: {
			content: `
DATABASE_URL=${databaseProviders[type]}
${addDatabaseEnvVars(type)}
`
		},
		dockerCompose: {
			dependsOn: {
				replacer: "restart: unless-stopped",
				content: "restart: unless-stopped\n\tdepends_on:\n\t  - postgres"
			},
			service: {
				content: addDockerCompose(type)
			}
		}
	};
}
