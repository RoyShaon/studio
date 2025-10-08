import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {};

const withPWA = withPWAInit({
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
});

export default withPWA(nextConfig);
