/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "51.21.132.147",
        port: "", // leave empty for default (80)
        pathname: "/**", // optional: restrict to /uploads
      },
    ],
  },
};

export default nextConfig;
