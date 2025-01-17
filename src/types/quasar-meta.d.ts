import { MetaOptions } from 'quasar';

declare module 'quasar' {
  export function useMeta(options: MetaOptions): void;
}
