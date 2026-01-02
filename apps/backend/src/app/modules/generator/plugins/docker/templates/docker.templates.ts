interface PackageManagerData {
	lockfile: string;
	install: string;
	build: string;
}

function getPackageManagerData(packageManager: "npm" | "yarn" | "pnpm"): PackageManagerData {
	switch (packageManager) {
		case "npm":
			return {
				lockfile: "package-lock.json",
				install: "npm ci",
				build: "npm run build"
			};
		case "yarn":
			return {
				lockfile: "yarn.lock",
				install: "yarn install --frozen-lockfile",
				build: "yarn build"
			};
		case "pnpm":
			return {
				lockfile: "pnpm-lock.yaml",
				install: "pnpm install --frozen-lockfile",
				build: "pnpm build"
			};
		default:
			return {
				lockfile: "package-lock.json",
				install: "npm ci",
				build: "npm run build"
			};
	}
}

export function createDockerfileTemplate(
	nodeVersion: string,
	packageManager: "npm" | "yarn" | "pnpm"
): { name: string; path: string; content: string } {
	const pmData = getPackageManagerData(packageManager);

	return {
		name: "Dockerfile",
		path: "",
		content: `
FROM node:${nodeVersion}

WORKDIR /usr/src/app

COPY package.json ./
COPY ${pmData.lockfile} ./

RUN ${pmData.install}

COPY . .

RUN ${pmData.build}

EXPOSE 4404

CMD ["node", "dist/main"]
`.trim()
	};
}

export function createDockerComposeTemplate(projectName: string): { name: string; path: string; content: string } {
	return {
		name: "docker-compose.yml",
		path: "",
		content: `
services:
  api:
    container_name: "${projectName}"
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "4404:4404"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
`.trim()
	};
}

export function createDockerIgnoreTemplate(): { name: string; path: string; content: string } {
	return {
		name: ".dockerignore",
		path: "",
		content: `
node_modules
dist
.git
.gitignore
.env
.env.*
*.md
*.log
.DS_Store
coverage
.nyc_output
`.trim()
	};
}
