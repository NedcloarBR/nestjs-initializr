import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

// biome-ignore lint/style/noDefaultExport: <explanation>
export default createMiddleware(routing);

export const config = {
	matcher: ["/", "/(pt-BR|en-US)/:path*"],
};
