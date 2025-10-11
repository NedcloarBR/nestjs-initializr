import localFont from "next/font/local";

export const materialIcons = localFont({
	src: [
		{
			path: "../../public/fonts/material-icons.woff2",
			weight: "400",
			style: "normal"
		}
	],
	display: "swap",
	variable: "--font-material-icons"
});
