/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  // any other next.js config you might have
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
