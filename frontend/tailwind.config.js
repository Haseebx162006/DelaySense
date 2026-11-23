/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Jet Black: Authentic, deep, technical charcoal blacks
        jet: {
          950: '#070709',
          900: '#0c0c0f',
          850: '#111116',
          800: '#17171e',
          750: '#1d1d26',
          700: '#252530',
        },
        // Backward-compatible alias for obsidian
        obsidian: {
          950: '#070709',
          900: '#0c0c0f',
          850: '#111116',
          800: '#17171e',
          750: '#1d1d26',
          700: '#252530',
          600: '#32323f',
        },
        // Smoke Gray: Neutral, crisp engineering grays
        smoke: {
          50: '#f9f9fb',
          100: '#f2f2f6',
          200: '#e4e4e9',
          300: '#d1d1d8',
          400: '#9e9ea8',
          500: '#71717e',
          600: '#484854',
          700: '#2c2c36',
          800: '#1e1e26',
          900: '#131319',
        },
        // Backward-compatible alias for sage
        sage: {
          50: '#f9f9fb',
          100: '#f2f2f6',
          200: '#e4e4e9',
          300: '#d1d1d8',
          400: '#9e9ea8',
          500: '#71717e',
        },
        // Cherry Red: The signature action and urgency color
        cherry: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48', // Primary button face
          700: '#be123c', // Hover button face
          800: '#9f1239', // Active button face
          900: '#881337',
          950: '#4c0519',
        },
        // Map legacy emerald tokens to clean smoke/cherry tones
        emerald: {
          400: '#d1d1d8',
          500: '#a1a1aa',
          600: '#71717e',
          700: '#484854',
          800: '#2c2c36',
          900: '#1e1e26',
          950: '#131319',
        },
      },
      boxShadow: {
        'cherry': '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(225, 29, 72, 0.4)',
        'cherry-hover': '0 4px 14px 0 rgba(225, 29, 72, 0.35)',
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'panel-raised': '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
