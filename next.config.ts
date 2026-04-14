import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 experimental: {
    serverActions: {
      allowedOrigins: [
        'lk9004fx-3000.asse.devtunnels.ms',
        'localhost:3000'
      ],
    },
  },
};

export default nextConfig;
