import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // torna a variável acessível no middleware
  },
};

export default nextConfig;