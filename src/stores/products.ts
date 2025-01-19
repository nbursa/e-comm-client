import { defineStore } from 'pinia';
import { CategoryCache, Product, ProductResponse } from '@/types';
import { storage } from '@/utils/storage';

export const useProductStore = defineStore('products', () => {
  const PRODUCTS_EXPIRATION = 5 * 60 * 1000;
  const PRODUCTS_KEY = 'products';
  const MAX_VIEWED = 10;

  const getStore = () => {
    const store = storage.get(PRODUCTS_KEY);
    if (!store) {
      return {
        cache: {},
        viewed: {
          products: [],
          timestamp: Date.now(),
        },
        categories: [],
        timestamp: Date.now(),
        version: '1.0',
      };
    }
    return store;
  };

  const initViewedCache = () => {
    const store = getStore();
    if (!store.viewed) {
      store.viewed = {
        products: [],
        timestamp: Date.now(),
      };
      storage.set(PRODUCTS_KEY, store, {
        expiration: PRODUCTS_EXPIRATION,
        version: '1.0',
      });
    }
  };

  const setCache = (data: ProductResponse, cacheKey: string): void => {
    const store = getStore();
    store.cache[cacheKey] = {
      data: data.data,
      meta: data.meta,
      timestamp: Date.now(),
    };

    storage.set(PRODUCTS_KEY, store, {
      expiration: PRODUCTS_EXPIRATION,
      version: '1.0',
    });
  };

  const getCache = (cacheKey: string) => {
    const store = getStore();
    return isCacheValid(cacheKey) ? store.cache[cacheKey] : null;
  };

  const clearCache = (cacheKey: string): void => {
    const store = getStore();

    if (cacheKey === 'viewed') {
      store.viewed = {
        products: [],
        timestamp: Date.now(),
      };
    } else if (store.cache[cacheKey]) {
      delete store.cache[cacheKey];
    }

    storage.set(PRODUCTS_KEY, store, {
      expiration: PRODUCTS_EXPIRATION,
      version: '1.0',
    });
  };

  const isCacheValid = (cacheKey: string): boolean => {
    const store = getStore();
    if (!store.cache[cacheKey]) return false;

    const cacheAge = Date.now() - store.cache[cacheKey].timestamp;
    return cacheAge < PRODUCTS_EXPIRATION;
  };

  const setViewedCache = (product: Product): void => {
    const store = getStore();

    store.viewed = {
      products: [
        product,
        ...(store.viewed?.products || []).filter((p: { id: number }) => p.id !== product.id),
      ].slice(0, MAX_VIEWED),
      timestamp: Date.now(),
    };

    storage.set(PRODUCTS_KEY, store, {
      expiration: PRODUCTS_EXPIRATION,
      version: '1.0',
    });
  };

  const getViewedCache = () => {
    const store = getStore();
    return store.viewed?.products?.length ? store.viewed : null;
  };

  const setCategoryCache = (categories: string[]): void => {
    const store = getStore();
    store.categories = categories;
    store.timestamp = Date.now();

    storage.set(PRODUCTS_KEY, store, {
      expiration: PRODUCTS_EXPIRATION,
      version: '1.0',
    });
  };

  const getCategoryCache = (): CategoryCache | null => {
    const store = getStore();
    return store.categories?.length
      ? {
          categories: store.categories,
          timestamp: store.timestamp,
        }
      : null;
  };

  return {
    setCache,
    getCache,
    isCacheValid,
    clearCache,
    setCategoryCache,
    getCategoryCache,
    setViewedCache,
    getViewedCache,
    initViewedCache,
  };
});
