"use client";

import { useTheme } from "next-themes";
import * as React from "react";

export function ToggleTheme() {
	const { setTheme, theme } = useTheme();

	return (
		<button type="button" className="cursor-pointer" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
			<span className="material-symbols-outlined text-primary-gradient">
				{theme === "light" ? "dark_mode" : "light_mode"}
			</span>
		</button>
	);
}
