/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["mongoose", "cloudinary"],
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
