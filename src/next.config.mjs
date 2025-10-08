import withPWA from '@ducanh2912/next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your Next.js config
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === 'development',
});

export default pwaConfig(nextConfig);
