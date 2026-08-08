import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dark: '#A07830',
          muted: '#C9A84C',
        },
        bg: {
          primary: '#08071A',
          section: '#0D0C22',
          accent: '#110F2A',
          card: '#14122E',
          dark: '#05040F',
        },
        text: {
          primary: '#F0EEF8',
          secondary: '#B8B4D0',
          muted: '#7A7890',
          light: '#55536A',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderColor: {
        gold: 'rgba(201, 168, 76, 0.15)',
        'gold-strong': 'rgba(201, 168, 76, 0.32)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        marquee: 'marquee 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
