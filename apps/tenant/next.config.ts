import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.uselearnbase.com",
      },
    ],
  },
};

export default nextConfig;
