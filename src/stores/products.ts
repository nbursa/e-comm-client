import { defineStore } from 'pinia';
import { Product } from '@/types';
import { storage } from '@/utils/storage';

export interface CacheEntry {
  products: Product[];
  timestamp: number;
  category: string;
}

export interface CategoryCache {
  categories: string[];
  timestamp: number;
}

export const useProductStore = defineStore('products', () => {
  const PRODUCTS_EXPIRATION = 5 * 60 * 1000;

  const getCacheKey = (category: string = 'all'): string => {
    return `products_${category}`;
  };

  const setCache = (products: Product[], category: string = 'all'): void => {
    const entry: CacheEntry = {
      products,
      timestamp: Date.now(),
      category,
    };
    storage.set(getCacheKey(category), entry, {
      expiration: PRODUCTS_EXPIRATION,
      version: '1.0',
    });
  };

  const getCache = (category: string = 'all'): CacheEntry | null => {
    return storage.get(getCacheKey(category));
  };

  const isCacheValid = (category: string = 'all'): boolean => {
    return !storage.isExpired(getCacheKey(category));
  };

  const setCategoryCache = (categories: string[]): void => {
    const cache: CategoryCache = {
      categories,
      timestamp: Date.now(),
    };
    storage.set('categories', cache, {
      expiration: PRODUCTS_EXPIRATION,
      version: '1.0',
    });
  };

  const getCategoryCache = (): CategoryCache | null => {
    return storage.get('categories');
  };

  const isCategoryCacheValid = (): boolean => {
    return !storage.isExpired('categories');
  };

  return {
    setCache,
    getCache,
    isCacheValid,
    setCategoryCache,
    getCategoryCache,
    isCategoryCacheValid,
  };
});
