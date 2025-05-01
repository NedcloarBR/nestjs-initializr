export const dockerFileTemplate = {
	name: "Dockerfile",
	path: "lavalink",
	content: `
    FROM ghcr.io/lavalink-devs/lavalink:4.0.8-alpine

    COPY application.yml /opt/Lavalink/application.yml
    COPY plugins/ /opt/Lavalink/plugins/

    USER lavalink
  `
};
