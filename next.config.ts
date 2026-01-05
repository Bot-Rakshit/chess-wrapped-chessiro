import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.chesscomfiles.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.lichess.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lichess1.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
