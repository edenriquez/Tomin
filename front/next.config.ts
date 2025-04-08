import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    images: { domains: [ "amazonaws.com", ], },

};

export default nextConfig;
