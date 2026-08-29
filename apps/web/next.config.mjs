/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "playwright-core"],
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium", "playwright-core"],
  },
};

export default nextConfig;
