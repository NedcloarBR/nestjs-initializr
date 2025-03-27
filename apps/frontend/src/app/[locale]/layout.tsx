import "@/styles/global.css";
import "flag-icons/css/flag-icons.css";
import { routing } from "@/lib/i18n/routing";
import { ThemeProvider } from "@/providers/theme-provider";
// import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
	params: Promise<{ locale: string }>;
}) {
	const params = await props.params;
	const { locale } = params;

	const t = await getTranslations({ locale, namespace: "Metadata" });

	return {
		title: t("Home.title"),
		description: t("Home.description"),
	};
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default async function LocaleLayout(props: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const params = await props.params;

	const { locale } = params;

	const { children } = props;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	const messages = await getMessages({ locale });

	return (
		<html lang={locale} suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
					<NextIntlClientProvider messages={messages}>
						{children}
						{/* <Analytics /> */}
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
