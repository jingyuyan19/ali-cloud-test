/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["sharon-test.oss-cn-beijing.aliyuncs.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.aliyuncs.com",
      },
    ],
  },
};

module.exports = nextConfig;
