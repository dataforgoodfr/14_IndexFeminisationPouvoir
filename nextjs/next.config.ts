import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export",
  trailingSlash: true,
  basePath: process.env.BASE_PATH,
  assetPrefix: process.env.BASE_PATH,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
