/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Remove existing SVG handling
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.test?.toString().includes("svg")) {
        return { ...rule, exclude: /\.svg$/i };
      }
      return rule;
    });

    // Add SVGR loader
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "51.21.132.147",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
