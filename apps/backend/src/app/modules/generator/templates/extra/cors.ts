export function cors(withConfigModule: boolean) {
	return {
		replacer: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};`,
		content: `
      const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};
      app.enableCors({
        origin: "*"
      });
    `
	};
}
