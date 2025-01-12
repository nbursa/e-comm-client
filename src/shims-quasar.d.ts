declare module 'quasar' {
  export function useQuasar<T = Record<string, unknown>>(): T & {
    dark: {
      isActive: boolean;
      set: (isDark: boolean) => void;
    };
  };

  export namespace scroll {
    export function getScrollTarget(element: HTMLElement | Window): HTMLElement | Window;
    export function getVerticalScrollPosition(scrollTarget: HTMLElement | Window): number;
    export function setVerticalScrollPosition(
      scrollTarget: HTMLElement | Window,
      offset: number,
    ): void;
  }
}

declare module 'quasar/src/components/form/QForm' {
  import { Component } from 'vue';
  const QForm: Component;
  export default QForm;
}
