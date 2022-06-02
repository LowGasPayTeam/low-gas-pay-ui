/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() { 
    return [ 
     //接口请求 前缀带上/api-text/
      { source: '/api/:path*', destination: `http://47.242.89.124:9999/api/:path*` }, 

    ]
  },
}

module.exports = nextConfig
