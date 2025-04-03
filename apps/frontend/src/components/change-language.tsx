"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui";

export function ChangeLanguage() {
	const t = useTranslations("Languages");
	const router = useRouter();
	const locale = useLocale();

	const changeLanguageHandler = (locale: string) => {
		router.replace(`/${locale}`);
	};

	const Languages = [
		{
			code: "pt-BR",
			flag: "br",
			name: t("pt-BR")
		},
		{
			code: "en-US",
			flag: "us",
			name: t("en-US")
		}
	];

	const currentLang = Languages.map((lang) => {
		if (locale === lang.code) return <span key={`key_${lang.code}`} className={`fi fi-${lang.flag} size-6`} />;
	});

	function DropdownLanguages() {
		const arr: ReactElement[] = [];
		for (const element of Languages) {
			arr.push(
				<DropdownMenuItem key={`key_${element.code}`} onClick={() => changeLanguageHandler(element.code)}>
					<div className="flex items-center gap-1">
						<span className={`fi fi-${element.flag}`} />
						<div>{element.name}</div>
					</div>
				</DropdownMenuItem>
			);
		}

		return arr;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<button type="button" className="cursor-pointer flex focus:outline-none">
					{currentLang}
					<span className="sr-only">{}</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center">{DropdownLanguages()}</DropdownMenuContent>
		</DropdownMenu>
	);
}
