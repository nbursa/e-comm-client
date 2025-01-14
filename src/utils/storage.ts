const STORAGE_KEY = 'e-comm-shop';
const DEBUG = import.meta.env.DEV;
const CACHE_KEYS = ['cart', 'exchange_rates', 'products'] as const;
const SETTINGS_KEYS = ['user_settings'] as const;

interface StorageOptions {
  expiration?: number;
  version?: string;
}

interface StorageValue {
  timestamp: number;
  version: string;
  expiration: number | null;
  [key: string]: unknown;
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

      return data[key] || null;
    } catch (error) {
      console.error('Storage read error:', error);
      return null;
    }
  },

  set: (key: string, value: unknown, options?: StorageOptions) => {
    try {
      const wrapper = localStorage.getItem(STORAGE_KEY) || '{}';
      const data = JSON.parse(wrapper);

      const entry: StorageValue = {
        timestamp: Date.now(),
        version: options?.version || '1.0',
        expiration: options?.expiration || null,
      };

      if (typeof value === 'object' && value !== null) {
        Object.assign(entry, value);
      } else {
        entry.data = value;
      }

      data[key] = entry;

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

  clearProductsCache: () => {
    try {
      const wrapper = localStorage.getItem(STORAGE_KEY) || '{}';
      const data = JSON.parse(wrapper);

      CACHE_KEYS.forEach((key) => {
        delete data[key];
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Storage clear cache error:', error);
    }
  },

  clearUserSettings: () => {
    try {
      const wrapper = localStorage.getItem(STORAGE_KEY) || '{}';
      const data = JSON.parse(wrapper);

      SETTINGS_KEYS.forEach((key) => {
        delete data[key];
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Storage clear settings error:', error);
    }
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
