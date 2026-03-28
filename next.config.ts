import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removes the "X-Powered-By: Next.js" header to reduce passive fingerprinting.
  poweredByHeader: false,
  images: {
    // Export/dev-friendly setting: avoid Next image optimization pipeline.
    unoptimized: true,
    // Allowlist remote images used by STORY_CONTENT.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    // Baseline security headers for all routes.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
