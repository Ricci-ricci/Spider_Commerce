import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        unoptimized: true,
        remotePatterns: [{ protocol: "https", hostname: "**" }],
    },
    async rewrites() {
        return [
            { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
            { source: "/uploads/:path*", destination: `${backendUrl}/uploads/:path*` },
        ];
    },
};

export default nextConfig;
