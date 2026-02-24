import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  basePath: '/14_IndexFeminisationPouvoir',
  assetPrefix: '/14_IndexFeminisationPouvoir',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
