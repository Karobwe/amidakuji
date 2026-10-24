/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.AMIDAKUJI_STATIC_EXPORT === "true" ? "export" : undefined,
};

export default nextConfig;
