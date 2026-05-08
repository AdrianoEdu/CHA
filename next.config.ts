import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*",

        destination:
          process.env.NODE_ENV === "production"
            ? "http://backend:3000/api/:path*"
            : "http://localhost:3000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
