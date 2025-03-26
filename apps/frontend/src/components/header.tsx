import { ToggleTheme } from "./toggle-theme";

export function Header() {
	return (
		<header className="h-17.5 bg-header-background">
			<ToggleTheme />
		</header>
	);
}
