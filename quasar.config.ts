import { defineConfig } from '@quasar/app-vite/wrappers';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig((ctx: { modeName: string }) => {
  return {
    preFetch: true,
    boot: ['ga', 'i18n', 'axios', 'theme'],
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons'],
    build: {
      env: {
        VITE_API_URL: process.env.VITE_API_URL,
        VITE_GA_ID: process.env.NODE_ENV === 'development' ? '' : process.env.VITE_GA_ID,
      },
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
      },
      vueRouterMode: 'history',
      extendViteConf(viteConf) {
        viteConf.base = process.env.NODE_ENV === 'production' ? '' : '/';
        viteConf.resolve ??= {};
        viteConf.resolve.alias = {
          ...viteConf.resolve.alias,
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        };
      },
      afterBuild: async () => {
        const fs = await import('fs/promises');
        const path = await import('path');
        const distDir = path.resolve(process.cwd(), 'dist/spa');
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
    },
    devServer: {
      port: 9000,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: true,
          ws: true,
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    },
    framework: {
      config: {
        brand: {
          primary: '#1a1a2e',
          'primary-light': '#c4c4c4',
          secondary: '#3c3c69',
          accent: '#00ffcc',
          dark: '#0D0A0B',
          light: '#F3EFF5',
        },
        dark: true,
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
      cssAddon: false,
    },
    animations: 'all',
    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false,
    },
    pwa: {
      workboxMode: 'GenerateSW',
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
