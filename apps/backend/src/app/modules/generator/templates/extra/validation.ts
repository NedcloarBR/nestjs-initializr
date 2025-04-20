export function validation(withConfigModule: boolean) {
	return [
		{
			replacer: "import { Logger ",
			content: "import { Logger, ValidationPipe "
		},
		{
			replacer: `const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};`,
			content: `
        const port = ${withConfigModule ? 'configService.get("PORT")' : 3000};
        app.useGlobalPipes(
          new ValidationPipe({
            always: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
          })
        );
      `
		}
	];
}
