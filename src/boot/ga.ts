import { boot } from 'quasar/wrappers';
import dotenv from 'dotenv';

dotenv.config();

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
  const gaId = process.env.VITE_GA_ID;

  if (process.env.NODE_ENV === 'production' && gaId) {
    router.afterEach((to) => {
      try {
        if (window.gtag) {
          window.gtag('config', gaId, {
            page_path: to.path,
            page_location: window.location.href,
            page_title: document.title,
          });
        }
      } catch (error) {
        console.error('GA tracking error:', error);
      }
    });
  }
  console.error('GA tracking id:', gaId);
});
