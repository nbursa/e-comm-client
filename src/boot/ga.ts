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
  const gaId = import.meta.env.VITE_GA_ID;

  if (gaId) {
    router.afterEach((to) => {
      if (window.gtag && gaId) {
        try {
          window.gtag('config', gaId, {
            page_path: to.path,
            page_location: window.location.href,
            page_title: document.title,
          });
        } catch (error) {
          console.error('GA tracking error:', error);
        }
      }
    });
  }
});
