
import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/zhn2ddaj/production/**",
      },
    ],
  },

  trailingSlash: false,

  async headers() {
    const ancestors =
      "'self' https://www.sanity.io https://ola-studio-zhn2ddaj.sanity.studio" +
      (process.env.NODE_ENV === "development"
        ? " http://localhost:3333"
        : "");

    const previewHeaders = [
      {
        key: "Content-Security-Policy",
        value: `frame-ancestors ${ancestors}`,
      },
      {
        key: "Referrer-Policy",
        value: "no-referrer",
      },
    ];

    return [
      {
        source: "/:locale(en|ru|sr)",
        headers: previewHeaders,
      },
      {
        source:
          "/:locale(en|ru|sr)/:page(about|balloons|bouquets|contact|weddings-events)",
        headers: previewHeaders,
      },
      {
        source: "/api/draft-mode/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
    ];
  },
};

export default createNextIntlPlugin("./src/i18n/request.ts")(
  nextConfig,
);
