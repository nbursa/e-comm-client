/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  prefix: 'tw-',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Forum', 'serif'],
      },
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
      colors: {
        'q-light-lighter': 'var(--q-bg-light-lighter)',
        'q-light': 'var(--q-bg-light)',
        'q-light-rgb': 'var(--q-bg-light-rgb)',
        'q-dark': 'var(--q-bg-dark)',
        'q-white': 'var(--q-bg-white)',
        'q-black': 'var(--q-bg-black)',
      },
    },
  },
  safelist: [
    'tw-bg-q-light-lighter',
    'tw-bg-q-light',
    'tw-bg-q-light-rgb',
    'tw-bg-q-dark',
    'tw-bg-q-dark',
    'tw-bg-q-white',
    'tw-bg-q-black',
    'tw-bg-gray-100',
    'tw-text-q-light',
    'tw-text-q-dark',
    'tw-text-q-white',
    'tw-text-q-black',
    'tw-text-gray-100',
  ],
  plugins: [],
} satisfies Config;
