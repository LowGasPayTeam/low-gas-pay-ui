/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() { 
    return [ 
      { source: '/api/:path*', destination: `https://lowgaspay.com/api/:path*` }, 
    ]
  },
}

module.exports = nextConfig
