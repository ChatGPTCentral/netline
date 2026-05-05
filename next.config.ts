import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.tradepub.com',
      },
    ],
  },
};

export default nextConfig;
