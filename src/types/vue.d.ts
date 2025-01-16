/// <reference types="vite/client" />
/// <reference types="@quasar/app-vite" />

import type { DefineComponent } from 'vue';
import type { QVueGlobals } from 'quasar';
import type { AxiosInstance } from 'axios';

// Vue SFC modules
declare module '*.vue' {
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

// Vue core augmentations
declare module 'vue' {
  export interface GlobalComponents {
    RouterView: (typeof import('vue-router'))['RouterView'];
    RouterLink: (typeof import('vue-router'))['RouterLink'];
  }

  interface ComponentCustomProperties {
    $q: QVueGlobals;
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }

  // Export Vue Composition API
  export {
    ref,
    computed,
    reactive,
    watch,
    watchEffect,
    onMounted,
    onUnmounted,
    nextTick,
    defineComponent,
    createApp,
  } from 'vue';
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    title?: string;
    layout?: string;
  }
}
