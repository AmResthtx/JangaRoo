import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7C3AED',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          DEFAULT: '#7C3AED',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#D97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#D97706',
        },
      },
      // CSS variable-driven overrides so each studio can theme by injecting
      // --color-primary and --color-gold into :root at the layout level.
      backgroundColor: {
        'brand-primary': 'rgb(var(--color-primary) / <alpha-value>)',
        'brand-gold':    'rgb(var(--color-gold)    / <alpha-value>)',
      },
      textColor: {
        'brand-primary': 'rgb(var(--color-primary) / <alpha-value>)',
        'brand-gold':    'rgb(var(--color-gold)    / <alpha-value>)',
      },
      borderColor: {
        'brand-primary': 'rgb(var(--color-primary) / <alpha-value>)',
        'brand-gold':    'rgb(var(--color-gold)    / <alpha-value>)',
      },
    },
  },
  plugins: [],
}

export default config
