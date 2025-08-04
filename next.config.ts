import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: false,
  },
  images: {
    domains: ["lh3.googleusercontent.com"], // Add more if needed
  },
};

export default nextConfig;
