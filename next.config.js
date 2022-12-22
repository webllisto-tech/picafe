/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "images.pexels.com",
      "source.unsplash.com",
      "43.205.117.141",
    ],
  },
};

module.exports = nextConfig;
