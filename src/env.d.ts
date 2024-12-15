declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   const component: DefineComponent<object, object, unknown>
//   export default component
// }
