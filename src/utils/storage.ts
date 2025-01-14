const STORAGE_KEY = 'e-comm-shop';
const DEBUG = import.meta.env.VITE_DEV;

interface StorageOptions {
  expiration?: number;
  version?: string;
}

export const storage = {
  get: (key: string) => {
    try {
      const wrapper = localStorage.getItem(STORAGE_KEY) || '{}';
      const data = JSON.parse(wrapper);
      const oldData = localStorage.getItem(key);

      if (!data[key] && oldData) {
        let parsed = oldData;
        try {
          parsed = JSON.parse(oldData);
        } catch {
          if (DEBUG) {
            console.info(`Migration: ${key} contains non-JSON data:`, oldData);
          }
        }
        storage.set(key, parsed);
        localStorage.removeItem(key);
        return parsed;
      }

      return data[key]?.value || data[key] || null;
    } catch (error) {
      console.error('Storage read error:', error);
      return null;
    }
  },

  set: (key: string, value: unknown, options?: StorageOptions) => {
    try {
      const wrapper = localStorage.getItem(STORAGE_KEY) || '{}';
      const data = JSON.parse(wrapper);
      data[key] = {
        value,
        timestamp: Date.now(),
        version: options?.version || '1.0',
        expiration: options?.expiration || null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (DEBUG) {
        console.info(`Storage: saved ${key}`);
      }
    } catch (error) {
      console.error('Storage write error:', error);
    }
  },

  remove: (key: string) => {
    try {
      const wrapper = localStorage.getItem(STORAGE_KEY) || '{}';
      const data = JSON.parse(wrapper);
      delete data[key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  clear: () => {
    localStorage.setItem(STORAGE_KEY, '{}');
  },

  getAll: () => {
    try {
      const wrapper = localStorage.getItem(STORAGE_KEY) || '{}';
      return JSON.parse(wrapper);
    } catch {
      return {};
    }
  },

  isExpired: (key: string): boolean => {
    const data = storage.getAll();
    const item = data[key];
    if (!item?.expiration) return false;
    return Date.now() > item.timestamp + item.expiration;
  },
};
