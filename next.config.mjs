/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, "@node-rs/bcrypt"];
    return config;
  },
};

export default nextConfig;
