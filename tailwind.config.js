const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'ui-sans-serif', 'system-ui'],
        body: ['DM Sans', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          blue: '#0076FF',
          red: '#D00000',
          silver: '#BFBFBF',
          black: '#0B0F1A',
          charcoal: '#1C1C1C',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            background: '#ffffff',
            content1: '#f7f7fa', // base cards
            content2: '#eef0f5', // lighter section surfaces
            divider: 'rgba(12,18,28,0.42)',
            foreground: '#0B0F1A', // text
            text: {
              DEFAULT: '#0B0F1A',
              secondary: 'rgba(11,15,26,0.7)',
            },
            primary: { DEFAULT: '#0047BB', foreground: '#ffffff' },
            danger: { DEFAULT: '#D00000', foreground: '#ffffff' },
            warning: { DEFAULT: '#D33F49', foreground: '#ffffff' },
            focus: '#0047BB',
          },
        },
        dark: {
          colors: {
            background: '#0B0F1A', // main background
            content1: 'rgba(255,255,255,0.03)', // cards
            content2: 'rgba(255,255,255,0.06)', // raised surfaces
            content3: '#141A22',
            divider: 'rgba(255,255,255,0.25)',
            foreground: '#E8ECF5', // primary text
            text: {
              DEFAULT: '#E8ECF5',
              secondary: 'rgba(232,236,245,0.7)',
            },
            primary: { DEFAULT: '#0047BB', foreground: '#FFFFFF' },
            danger: { DEFAULT: '#D00000', foreground: '#FFFFFF' },
            warning: { DEFAULT: '#D33F49', foreground: '#FFFFFF' },
            focus: '#0076FF',
          },
        },
      },
    }),
    require('@tailwindcss/typography'), // ← add this AFTER HeroUI
  ],
};
