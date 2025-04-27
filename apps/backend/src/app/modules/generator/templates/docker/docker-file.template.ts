import type { MetadataDTO } from "../../dtos/metadata.dto";

export function dockerfileTemplate(
	nodeVersion: MetadataDTO["packageJson"]["nodeVersion"],
	packageManager: MetadataDTO["packageManager"]
) {
	function getPackageManagerData(packageManager: MetadataDTO["packageManager"]) {
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
		}
	}
	const packageManagerData = getPackageManagerData(packageManager);

	return {
		name: "Dockerfile",
		path: "",
		content: `
      FROM node:${nodeVersion}

      WORKDIR /usr/src/app

      COPY package.json ./
      COPY ${packageManagerData.lockfile} ./

      RUN ${packageManagerData.install}

      COPY . .

      RUN ${packageManagerData.build}

      EXPOSE 4404

      CMD ["node", "dist/main"]
    `
	};
}
