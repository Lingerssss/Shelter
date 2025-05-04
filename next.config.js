/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // 禁用部分优化以排除CSS问题
    poweredByHeader: false,
    // 即使在生产环境也包括所有CSS
    experimental: {
      optimizeCss: false
    }
  }
  
  module.exports = nextConfig