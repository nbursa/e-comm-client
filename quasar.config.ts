import { defineConfig } from '@quasar/app-vite/wrappers';
import { fileURLToPath } from 'node:url';
import type { UserConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

console.log('NODE_ENV:', process.env.NODE_ENV);

export default defineConfig((ctx) => {
  console.log('ctx:', ctx);
  return {
    preFetch: true,
    boot: ['i18n', 'init', 'ga', 'axios', 'theme', 'lightbox'],
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons'],
    set: false,
    pwd: 999,
    build: {
      env: {
        VITE_GA_ID: process.env.VITE_GA_ID,
        VITE_API_URL: process.env.VITE_API_URL,
        VITE_RN: process.env.VITE_RN,
        VITE_RATES_API_URL: process.env.VITE_RATES_API_URL,
        VITE_EMAIL_ADMIN: process.env.VITE_EMAIL_ADMIN,
        VITE_STORAGE_KEY: process.env.VITE_STORAGE_KEY,
      },
      publicPath: '/',
      vueRouterMode: 'history',
      distDir: 'dist/spa',
      postcss: {
        plugins: ['tailwindcss', 'autoprefixer'],
      },
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
      typescript: {
        strict: true,
        vueShim: true,
        useVueTsc: true,
        moduleResolution: 'bundler',
        tsconfigPath: './tsconfig.json',
      },

      extendViteConf(viteConf: UserConfig) {
        viteConf.base = '/';
        viteConf.resolve ??= {};
        viteConf.resolve.alias = {
          ...viteConf.resolve.alias,
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        };
      },
      afterBuild: async () => {
        const fs = await import('fs/promises');
        const path = await import('path');
        const distDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist/spa');

        await fs.copyFile(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
      },
      vitePlugins: [
        [
          '@intlify/unplugin-vue-i18n/vite',
          {
            ssr: ctx.modeName === 'ssr',
            include: [fileURLToPath(new URL('./src/i18n', import.meta.url))],
          },
        ],
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          { server: false },
        ],
      ],
      minify: true,
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      cssMinifier: 'esbuild',
      preloadChunks: true,
      prefetchChunks: true,
      assetsDir: 'assets',
      emptyOutDir: true,
    },
    devServer: {
      port: 9000,
      open: false,
    },
    framework: {
      config: {
        brand: {
          primary: '#1A202C',
          'primary-light': '#E2E8F0',
          secondary: '#FF6F61',
          accent: '#FFD700',
          dark: '#1A202C',
          'dark-lighter': '#2D3748',
          'bg-dark': '#1A202C',
          'dark-rgb': 'rgba(26, 32, 44, 0.95)',
          'light-rgb': 'rgba(242, 239, 233, 0.95)',
          light: '#BFB48F',
          'light-lighter': '#D1C9AD',
          'bg-light': '#BFB48F',
          black: '#121212',
          white: '#FFFFFF',
          'light-page': 'linear-gradient(135deg, #BFB48F 0%, #FFFFFF 50%, #BFB48F 80%)',
          'dark-page': 'linear-gradient(135deg, #1A202C 30%, #0D1117 50%, #1A202C 70%)',
        },
        dark: true,
      },
      utilities: true,
      plugins: ['Meta', 'Notify', 'Loading', 'Dialog'],
      cssAddon: false,
    },
    animations: 'all',
    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false,
    },
    pwa: {
      workboxMode: 'InjectManifest',
      options: null,
    },
    capacitor: {
      hideSplashscreen: true,
    },
    electron: {
      bundler: 'builder',
      inspectPort: 5858,
      builder: {
        appId: 'e-commerce-platform',
      },
    },
  };
});
