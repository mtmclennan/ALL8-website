/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx';
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: { mdxRs: true }, // Rust-based MDX compiler (Turbopack)
  images: {
    deviceSizes: [320, 480, 540, 640, 750, 828, 1080, 1200],
    imageSizes: [100, 200, 300, 400, 540],
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    optimizePackageImports: ['@heroui/system'],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
