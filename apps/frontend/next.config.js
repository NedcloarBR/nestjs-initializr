//@ts-check
const { composePlugins, withNx } = require("@nx/next");
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/**
 * @type {import("@nx/next/plugins/with-nx").WithNxOptions}
 **/
const nextConfig = {
	output: "standalone",
	eslint: {
		ignoreDuringBuilds: true
	},
	trailingSlash: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_INTERNAL_URL}/api/:path*`
      }
    ];
  }
};

const plugins = [
	// Add more Next.js plugins to this list if needed.
	withNx,
	withNextIntl
];

module.exports = composePlugins(...plugins)(nextConfig);
