import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// biome-ignore lint/style/noDefaultExport: <>
export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale;
	// biome-ignore lint/suspicious/noExplicitAny: <>
	if (!(locale && routing.locales.includes(locale as any))) {
		locale = routing.defaultLocale;
	}

	return {
		locale,
		messages: (await import(`../../../public/locales/${locale}.json`)).default
	};
});
