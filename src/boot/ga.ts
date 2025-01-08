import { boot } from 'quasar/wrappers';

type GtagArg = 'config' | 'js' | 'event';
type GtagParams = Record<string, unknown>;
type GtagData = [GtagArg, string | Date] | [GtagArg, string | Date, GtagParams];

declare global {
  interface Window {
    dataLayer: GtagData[];
    gtag: (type: GtagArg, action: string | Date, params?: GtagParams) => void;
  }
}

export default boot(({ router }) => {
  if (process.env.NODE_ENV === 'production' && process.env.VITE_GA_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.VITE_GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (type: GtagArg, action: string | Date, params?: GtagParams) {
      window.dataLayer.push(params ? [type, action, params] : [type, action]);
    };
    window.gtag('js', new Date());
    window.gtag('config', process.env.VITE_GA_ID);
  }

  router.beforeEach((to) => {
    if (window.gtag && process.env.VITE_GA_ID) {
      window.gtag('config', process.env.VITE_GA_ID, {
        page_path: to.path,
        send_page_view: true,
      });
    }
  });
});
