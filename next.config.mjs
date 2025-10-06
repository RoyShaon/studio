
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is experimental and may change in the future.
    // See https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  },
};

export default withPWA(nextConfig);

    