import { boot } from 'quasar/wrappers';
import QButton from '@/components/base/QButton.vue';

export default boot(({ app }) => {
  app.component('QButton', QButton);
});
