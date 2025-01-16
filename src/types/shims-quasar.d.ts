declare module 'quasar' {
  interface DialogButtonOptions {
    label?: string;
    flat?: boolean;
    outline?: boolean;
    color?: string;
    textColor?: string;
  }

  interface DialogOptions {
    title?: string;
    message?: string;
    html?: boolean;
    class?: string;
    persistent?: boolean;
    ok?: DialogButtonOptions;
    cancel?: DialogButtonOptions;
  }

  interface DialogChainObject {
    onOk: (handler: () => void) => void;
    onCancel: (handler: () => void) => void;
    onDismiss: (handler: () => void) => void;
  }

  interface NotifyOptions {
    message?: string;
    color?: string;
    type?: 'positive' | 'negative' | 'warning' | 'info' | 'ongoing';
    position?:
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'center';
    timeout?: number;
    class?: string;
    icon?: string;
    actions?: Array<{
      label?: string;
      color?: string;
      handler: () => void;
    }>;
  }

  interface QVueGlobals {
    dark: {
      isActive: boolean;
      set: (value: boolean) => void;
      toggle: () => void;
    };
    screen: {
      lt: { [key: string]: boolean };
      gt: { [key: string]: boolean };
      xs: boolean;
      sm: boolean;
      md: boolean;
      lg: boolean;
      xl: boolean;
      width: number;
      height: number;
    };
    notify: {
      (opts: NotifyOptions): void;
      create(opts: NotifyOptions): void;
      setDefaults(opts: NotifyOptions): void;
      registerType(name: string, opts: NotifyOptions): void;
    };
    loading: {
      show(opts?: object): void;
      hide(): void;
    };
    dialog: (opts: DialogOptions) => DialogChainObject;
    debounce: <T extends (...args: unknown[]) => unknown>(fn: T, wait?: number) => T;
  }

  export function useQuasar(): QVueGlobals;

  export namespace scroll {
    export function getScrollTarget(element: HTMLElement | Window): HTMLElement | Window;
    export function getVerticalScrollPosition(scrollTarget: HTMLElement | Window): number;
    export function setVerticalScrollPosition(
      scrollTarget: HTMLElement | Window,
      offset: number,
    ): void;
  }
}
