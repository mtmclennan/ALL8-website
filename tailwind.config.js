const { heroui } = require('@heroui/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // add if you use /src
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
      defaultTheme: 'dark',
      themes: {
        light: {
          colors: {
            // surfaces
            background: '#ffffff',
            content1: '#f7f7fa',
            content2: '#eef0f5',
            divider: 'rgba(12,18,28,0.42)',
            foreground: '#0B0F1A',
            // brand
            primary: { DEFAULT: '#0047BB', foreground: '#ffffff' },
            focus: '#0047BB',
          },
        },
        dark: {
          colors: {
            background: '#0B0F1A',
            content1: 'rgba(255,255,255,0.03)',
            content2: 'rgba(255,255,255,0.06)',
            divider: 'rgba(255,255,255,0.50)',
            foreground: '#f5f7fb',
            primary: { DEFAULT: '#0047BB', foreground: '#FFFFFF' }, // <— was #000000
            focus: '#0047BB',
          },
        },
      },
    }),
  ],
};
