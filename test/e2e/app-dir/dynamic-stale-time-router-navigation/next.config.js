/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 180, // Non-zero value to trigger the bug
      static: 180,
    },
  },
}

module.exports = nextConfig
