import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['dlsu-portal-be-production.up.railway.app', 'localhost'],
  },
  output: 'standalone',
};

export default nextConfig;
