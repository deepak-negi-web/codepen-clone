module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      child_process: false,
    };

    return config;
  },
  images: {
    domains: ["img.icons8.com", "firebasestorage.googleapis.com"],
  },
};
