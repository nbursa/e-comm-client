import { boot } from 'quasar/wrappers';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export default boot(({ router }) => {
  router.beforeEach((to) => {
    if (process.env.NODE_ENV === 'production' && process.env.VITE_GA_ID) {
      window.gtag('config', process.env.VITE_GA_ID, {
        page_path: to.path,
        send_page_view: true,
      });
    }
  });
});
