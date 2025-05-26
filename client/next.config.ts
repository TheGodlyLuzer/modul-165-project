import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    reactStrictMode: true,
    env: {
        API_URL: 'http://localhost:3001/api'
    }
};

export default nextConfig;
