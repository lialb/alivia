import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/alivia",
  assetPrefix: "/alivia/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
