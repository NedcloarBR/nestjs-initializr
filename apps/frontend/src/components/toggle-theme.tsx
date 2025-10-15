"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui";

export function ToggleTheme() {
	const { setTheme, theme } = useTheme();

	return (
		<Button
			type="button"
			variant="ghost"
			className="cursor-pointer"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
			<span className="material-icons text-nest-primary-gradient hover:text-black dark:hover:text-white">
				{theme === "light" ? "dark_mode" : "light_mode"}
			</span>
		</Button>
	);
}
