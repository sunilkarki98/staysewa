import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "azdawgxfpeypxeqvuejh.supabase.co",
      },
    ],
  },
  // Forcing root to current directory to avoid scanning up to home
  outputFileTracingRoot: process.cwd(),
};

export default withBundleAnalyzer(nextConfig);
