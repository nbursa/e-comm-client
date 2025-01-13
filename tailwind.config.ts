/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  prefix: 'tw-',
  theme: {
    extend: {
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      colors: {},
    },
  },
  safelist: ['tw-bg-[var(--q-bg-light)]', 'tw-bg-[var(--q-bg-dark)]'],
  plugins: [],
} satisfies Config;
