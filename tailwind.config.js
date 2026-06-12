/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        foreground: '#d4d4d8',
        'cyan-glow': '#00ffff',
        'cyan-accent': '#00faef',
        'blue-primary': '#1828FF',
        'orange-warning': '#FF3E4A',
      },
      screens: {
        mobile: '479px',
        tablet: '768px',
        xs: '475px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['JetBrains Mono', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};