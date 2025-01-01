declare module 'quasar' {
  export function useQuasar<T = Record<string, unknown>>(): T & {
    dark: {
      isActive: boolean;
      set: (isDark: boolean) => void;
    };
  };
}
