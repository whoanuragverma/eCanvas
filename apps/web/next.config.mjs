/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium", "playwright-core"],
    outputFileTracingIncludes: {
      "/api/widget/*/png": ["./node_modules/@sparticuz/chromium/bin/**"],
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const externals = Array.isArray(config.externals)
        ? config.externals
        : config.externals
          ? [config.externals]
          : [];

      config.externals = [...externals, "@sparticuz/chromium", "playwright-core"];
    }

    return config;
  },
};

export default nextConfig;
