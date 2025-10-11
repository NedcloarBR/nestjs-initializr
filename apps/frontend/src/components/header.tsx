import Link from "next/link";
import { ChangeLanguage } from "./change-language";
import { ToggleTheme } from "./toggle-theme";
import { Icon } from "./ui";

export function Header() {
	return (
		<header className="flex h-17.5 w-screen items-center bg-nest-header-background">
			<div className="flex-1" />
			<div className="mr-8 flex gap-2">
				<Link
					type="button"
					className="flex items-center justify-center gap-6"
					href="https://github.com/NedcloarBR/nestjs-initializr"
					target="_blank"
					rel="noopener noreferrer">
					<Icon name="github" iconType="svg" className="size-6" />
				</Link>
				<ToggleTheme />
				<ChangeLanguage />
			</div>
		</header>
	);
}
