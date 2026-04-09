import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@palpiteiro/ai-orchestrator",
    "@palpiteiro/data-sources",
    "@palpiteiro/domain",
    "@palpiteiro/probability-engine",
  ],
};

export default nextConfig;
