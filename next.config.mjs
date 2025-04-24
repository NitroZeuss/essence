/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}
export default nextConfig

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: /node_modules/,
    });

    return config;
  },
};
