"use client";

import { useTheme } from "next-themes";
import * as React from "react";

export function ToggleTheme() {
	const { setTheme, theme } = useTheme();

	return (
		<button
			type="button"
			className="cursor-pointer fill-primary-red text-primary-red hover:text-white"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
			{theme === "light" ? (
				<span className="material-symbols-outlined">dark_mode</span>
			) : (
				<span className="material-symbols-outlined">light_mode</span>
			)}
		</button>
	);
}
