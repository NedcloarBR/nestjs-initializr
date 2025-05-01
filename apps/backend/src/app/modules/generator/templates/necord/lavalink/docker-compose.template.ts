export const dockerComposeTemplate = {
	name: "docker-compose.yml",
	path: "lavalink",
	content: `
    services:
      lavalink:
        build: .
        container_name: lavalink
        restart: unless-stopped
        environment:
          - _JAVA_OPTIONS=-Xmx6G
          - SERVER_PORT=2333
          - LAVALINK_SERVER_PASSWORD=youshallnotpass
        expose:
          - 2333
        ports:
          - "2333:2333"
        networks:
          - network

    networks:
      network:
        driver: bridge
  `
};
