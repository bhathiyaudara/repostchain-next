import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
