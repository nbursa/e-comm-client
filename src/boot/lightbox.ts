import { boot } from 'quasar/wrappers';
import VueEasyLightbox from 'vue-easy-lightbox';

export default boot(({ app }) => {
  app.use(VueEasyLightbox);
});
