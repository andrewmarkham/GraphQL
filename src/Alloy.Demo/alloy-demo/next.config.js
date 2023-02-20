/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  trailingSlash: true,
  images: {
    domains: ['localhost','alloy-graph-admin.azurewebsites.net'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/globalassets/**',
      },
    ]
  }
}

module.exports = nextConfig
