import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  distDir: '.next',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

export default nextConfig
