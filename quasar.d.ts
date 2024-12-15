declare module '#q-app/wrappers' {
  import type { App } from 'vue';
  import type { Router } from 'vue-router';
  import type { Pinia } from 'pinia';

  /**
   * Context provided to the `defineConfig` callback in `quasar.config.ts`.
   */
  export interface QuasarContext {
    modeName: 'spa' | 'pwa' | 'ssr' | 'bex' | 'cordova' | 'capacitor' | 'electron';
    prod: boolean;
    dev: boolean;
    debug: boolean;
    mode: {
      name: 'spa' | 'pwa' | 'ssr' | 'bex' | 'cordova' | 'capacitor' | 'electron';
    };
  }

  /**
   * Define a boot file for Quasar.
   */
  export function defineBoot(
    callback: (params: { app: App; router?: Router; store?: Pinia }) => void,
  ): void;

  /**
   * Define the main Quasar configuration file.
   */
  export function defineConfig(callback: (ctx: QuasarContext) => object): object;
  export function defineConfig(callback: unknown): unknown;
  /**
   * Define a custom router setup for Quasar.
   */
  export function defineRouter(callback: () => Router): void;

  /**
   * Define a store setup (Pinia-specific).
   */
  export function defineStore<T extends object>(store: T): T;
}
