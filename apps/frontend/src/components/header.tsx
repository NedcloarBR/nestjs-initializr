import { ChangeLanguage } from "./change-language";
import { ToggleTheme } from "./toggle-theme";

export function Header() {
	return (
		<header className="flex items-center w-screen h-17.5 bg-nest-header-background">
			<div className="flex-1" />
			<div className="mr-8 flex gap-2">
				<ToggleTheme />
				<ChangeLanguage />
			</div>
		</header>
	);
}
