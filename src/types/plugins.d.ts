declare module 'vite-plugin-html' {
  import { Plugin } from 'vite';
  interface Options {
    inject?: {
      data: Record<string, string>;
    };
  }
  export function createHtmlPlugin(options?: Options): Plugin;
  export default createHtmlPlugin;
}

declare module '@intlify/unplugin-vue-i18n/vite' {
  import { Plugin } from 'vite';
  interface Options {
    ssr: boolean;
    include: string[];
  }
  const plugin: (options?: Options) => Plugin;
  export default plugin;
}
