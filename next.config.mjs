// /** @type {import('next').NextConfig} */
// import createMDX from '@next/mdx';
// const nextConfig = {
//   pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
//   experimental: { mdxRs: true }, // Rust-based MDX compiler (Turbopack)
//   images: {
//     deviceSizes: [320, 480, 540, 640, 750, 828, 1080, 1200],
//     imageSizes: [100, 200, 300, 400, 540],
//     formats: ['image/avif', 'image/webp'],
//   },

//   experimental: {
//     optimizePackageImports: ['@heroui/system'],
//   },
// };

// const withMDX = createMDX({
//   // Add markdown plugins here, as desired
// });

// export default withMDX(nextConfig);
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,

  // your existing stuff here
  experimental: {
    mdxRs: true,
    optimizeCss: true,
    optimizePackageImports: ['@heroui/react', 'framer-motion'],
  },
  // modularizeImports: {
  //   '@heroui/react': { transform: '@heroui/react/{{member}}' },
  // 'framer-motion': { transform: 'framer-motion/{{member}}' },
  // },
};

export default withAnalyzer(nextConfig);
