/** @type {import('next').NextConfig} */
const nextConfig = {
  // This rewrite configuration is a workaround to prevent Netlify and other
  // hosting providers from serving the `index.html` file from the `public`
  // directory, which was created by Firebase. By rewriting these paths to
  // a non-existent destination with a 404 status, we ensure that the
  // Next.js application is always served as the main entry point.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/index.html',
          destination: '/:path*',
          has: [],
        },
        {
          source: '/404.html',
          destination: '/:path*',
          has: [],
        },
      ],
    };
  },
};

export default nextConfig;
