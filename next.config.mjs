// next.config.mjs

import withPWA from "next-pwa";

// Configuration options for Next.js
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true,      // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  // Add rewrites configuration to handle sitemap URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml', // Redirect to the API route for sitemap
      },
      {
        source: '/sitemap-articles.xml',
        destination: '/api/sitemap-articles.xml', // Redirect to the API route for article sitemap
      },
      {
        source: '/sitemap-latest-articles.xml',
        destination: '/api/sitemap-latest-articles.xml', // Redirect to the API route for article sitemap
      },
    ];
  },
};

// Configuration object tells the next-pwa plugin
const pwaConfig = {
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
};

// Export the combined configuration for Next.js with PWA support
export default withPWA(pwaConfig)(nextConfig);
