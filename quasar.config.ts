import { defineConfig } from '@quasar/app-vite/wrappers';
import { fileURLToPath } from 'node:url';

export default defineConfig((ctx: { modeName: string }) => {
  return {
    preFetch: true,
    boot: ['i18n', 'axios', 'theme'],
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons'],
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
      typescript: {
        strict: true,
        vueShim: true,
      },
      vueRouterMode: 'history',
      env: {
        VITE_API_URL: process.env.VITE_API_URL,
      },
      extendViteConf(viteConf) {
        viteConf.resolve ??= {};
        viteConf.resolve.alias = {
          ...viteConf.resolve.alias,
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        };
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
      open: false,
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
          white: '#ffffff',
          night: '#0D0A0B',
          charcoal: '#454955',
          magnolia: '#F3EFF5',
          applegreen: '#72B01D',
          officegreen: '#3F7D20',
        },
        dark: true,
      },
      plugins: ['Notify', 'Loading'],
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
    cordova: {},
    capacitor: {
      hideSplashscreen: true,
    },
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'e-commerce-platform',
      },
    },
    bex: {
      extraScripts: [],
    },
  };
});
