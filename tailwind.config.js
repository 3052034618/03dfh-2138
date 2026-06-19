/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', '"ZCOOL QingKe HuangYou"', 'system-ui'],
        body: ['"Noto Sans SC"', 'system-ui'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        brand: {
          orange: '#FF6B35',
          yellow: '#FFE66D',
          purple: '#7B2CBF',
          blue: '#4CC9F0',
          pink: '#F72585',
          green: '#A7C957',
          peach: '#F4A261',
        },
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
};
