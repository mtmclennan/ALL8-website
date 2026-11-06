import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  esbuild: { jsx: 'automatic' },
  test: {
    include: ['tests/integration/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['tests/integration/setup.ts'],
    restoreMocks: true,
    env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'all8-test-site-key', RECAPTCHA_SECRET: 'all8-test-secret' },
  },
});
