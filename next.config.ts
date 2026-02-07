import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co", // For mock data
      },
      {
        protocol: "https",
        hostname: "**.supabase.co", // For real storage later
      },
    ],
  },
};

export default nextConfig;