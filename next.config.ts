import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.sndcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'repostchain.com',
      },
      {
        protocol: 'https',
        hostname: 'growmusicians.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/auth/soundcloud/redirect',
        destination: '/api/auth/soundcloud/redirect',
      },
      {
        source: '/auth/soundcloud/callback',
        destination: '/api/auth/soundcloud/callback',
      },
      {
        source: '/soundcloud/redirect',
        destination: '/api/auth/soundcloud/redirect',
      },
      {
        source: '/soundcloud/callback',
        destination: '/api/auth/soundcloud/callback',
      },
    ];
  },
};

export default nextConfig;
