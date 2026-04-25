import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
 experimental: {
    serverActions: {
      allowedOrigins: [
        'lk9004fx-3000.asse.devtunnels.ms',
        'localhost:3000'
      ],
    },
  },
    images: {
    domains: ["encrypted-tbn0.gstatic.com", "images.unsplash.com"],
  },
};

const pwa = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

export default pwa(nextConfig as any);