/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships as ESM-only in places; transpile it so Vercel's build doesn't choke
  transpilePackages: ['three'],
  webpack: (config) => {
    // Prevents "Can't resolve 'canvas'" errors some three.js/drei sub-deps
    // try to pull in during server-side bundling.
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig;
