import { MetaOptions } from 'quasar';

declare module 'quasar' {
  export function useMeta(options: MetaOptions): void;
  export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, wait: number): T;
}
