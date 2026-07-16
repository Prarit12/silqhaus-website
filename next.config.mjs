import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 80],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  serverExternalPackages: ["@neondatabase/serverless"],
  async redirects() {
    return [
      {
        source: "/blog/:slug",
        destination: "/guides/:slug",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/guides",
        permanent: true,
      },
      {
        source: "/experience",
        destination: "/experiences",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
