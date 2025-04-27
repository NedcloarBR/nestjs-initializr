export function dockerComposeTemplate(projectName: string) {
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
    `
	};
}
