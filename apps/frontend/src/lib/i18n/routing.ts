import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en-US", "pt-BR"],
	defaultLocale: "en-US",
	localeDetection: true,
	localePrefix: {
		mode: "always",
		prefixes: {
			"en-US": "/en-US",
			"pt-BR": "/pt-BR"
		}
	},
	pathnames: {
		"/": "/"
	}
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
