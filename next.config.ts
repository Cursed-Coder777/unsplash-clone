import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['plus.unsplash.com','images.unsplash.com']
  }
};

export default nextConfig;
