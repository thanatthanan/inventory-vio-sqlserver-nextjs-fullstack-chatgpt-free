/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Ignore build errors in the specified directory
    if (!isServer) {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        include: /\/src\/pages\/\(notuse\)/,
        loader: 'ignore-loader',
      });
    }

    return config;
  },
};

module.exports = nextConfig;
