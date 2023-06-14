/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:5177/api/:path*',
          },
        ]
    }
}

module.exports = nextConfig
