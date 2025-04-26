//@ts-check
const { composePlugins, withNx } = require("@nx/next");
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/**
 * @type {import("@nx/next/plugins/with-nx").WithNxOptions}
 **/
const nextConfig = {
	output: "standalone",
	nx: {
		// Set this to true if you would like to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: false
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	trailingSlash: false,
	env: {
		BACKEND_URL: process.env.FRONTEND_BACKEND_URL
	}
};

const plugins = [
	// Add more Next.js plugins to this list if needed.
	withNx,
	withNextIntl
];

module.exports = composePlugins(...plugins)(nextConfig);
