/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is required to allow the Next.js dev server to be accessed from the
    // Firebase Studio preview pane.
    allowedDevOrigins: [
      "https://*.cluster-isls3qj2gbd5qs4jkjqvhahfv6.cloudworkstations.dev",
    ],
  },
};

export default nextConfig;
