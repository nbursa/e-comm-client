/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  prefix: 'tw-',
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
