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
        obsidian: {
          950: '#050807',
          900: '#090d0b',
          850: '#0d1310',
          800: '#121a16',
          700: '#1b2721',
          600: '#26372f',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        sage: {
          50: '#f8faf9',
          100: '#eef3f0',
          200: '#dae5df',
          300: '#b8ccc2',
          400: '#8ba697',
          500: '#647e70',
        },
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-emerald-lg': '0 0 50px -10px rgba(16, 185, 129, 0.45)',
        'glow-capsule': '0 0 40px -8px rgba(52, 211, 153, 0.28), inset 0 0 20px -5px rgba(52, 211, 153, 0.2)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(16, 185, 129, 0.15)',
        'glow-card-hover': '0 15px 35px -10px rgba(0, 0, 0, 0.8), 0 0 20px 2px rgba(16, 185, 129, 0.22)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'radar': 'radar 4s linear infinite',
        'glow': 'glow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.25))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(52, 211, 153, 0.55))' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        'emerald-dark-gradient': 'linear-gradient(180deg, #0d1310 0%, #050807 100%)',
      },
    },
  },
  plugins: [],
};
