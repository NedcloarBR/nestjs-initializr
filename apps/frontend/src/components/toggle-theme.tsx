"use client";

import { useTheme } from "next-themes";

export function ToggleTheme() {
	const { setTheme, theme } = useTheme();

	return (
		<button
			type="button"
			className="cursor-pointer absolute right-10"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
			<span className="material-icons text-primary-gradient hover:text-white">
				{theme === "light" ? "dark_mode" : "light_mode"}
			</span>
		</button>
	);
}
