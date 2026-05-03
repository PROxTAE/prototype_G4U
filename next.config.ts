import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow access via IP for Server Actions */
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.local", "*"],
    },
  },
  /* Optional: Useful for testing on mobile to avoid image optimization issues on different IPs */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
