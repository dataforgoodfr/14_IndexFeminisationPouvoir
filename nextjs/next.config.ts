import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export",
  trailingSlash: true,
  // This should be injected by CI, but currently the next.config.ts extension isn't supported
  // cf https://github.com/actions/configure-pages/issues/177
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    unoptimized: true,
  },
};

const withNextIntl = createNextIntlPlugin({ experimental: {} });
export default withNextIntl(nextConfig);
