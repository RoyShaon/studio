/** @type {import('next').NextConfig} */
import createNextPwa from "next-pwa";

const withPWA = createNextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
    experimental: {
      allowedDevOrigins: ["*.cloudworkstations.dev"],
    }
};

export default withPWA(nextConfig);
