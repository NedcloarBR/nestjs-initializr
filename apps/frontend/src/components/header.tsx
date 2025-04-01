import { ChangeLanguage } from "./change-language";
import { ToggleTheme } from "./toggle-theme";

export function Header() {
	return (
		<header className="w-full h-17.5 bg-nest-header-background flex items-center">
			<ToggleTheme />
			<ChangeLanguage />
		</header>
	);
}
