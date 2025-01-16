declare module 'vue-i18n' {
  import type { Composer, ComposerOptions } from '@intlify/core-base';
  export * from '@intlify/core-base';
  export function useI18n<Options extends ComposerOptions>(options?: Options): Composer;
  export const createI18n: typeof import('@intlify/core-base').createI18n;
}
