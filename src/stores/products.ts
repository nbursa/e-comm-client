import { Product } from '@/types';
import { defineStore } from 'pinia';

export interface CacheEntry {
  products: Product[];
  timestamp: number;
  category: string;
}

export interface CategoryCache {
  categories: string[];
  timestamp: number;
}

export const useProductCacheStore = defineStore('productCache', {
  state: () => ({
    cacheMap: new Map<string, CacheEntry>(),
    categoryCache: null as CategoryCache | null,
    cacheDuration: 5 * 60 * 1000,
  }),

  actions: {
    getCacheKey(category: string = 'all'): string {
      return `products_${category}`;
    },

    setCache(products: Product[], category: string = 'all'): void {
      const entry: CacheEntry = {
        products,
        timestamp: Date.now(),
        category,
      };
      this.cacheMap.set(this.getCacheKey(category), entry);
      localStorage.setItem(this.getCacheKey(category), JSON.stringify(entry));
    },

    getCache(category: string = 'all'): CacheEntry | null {
      const entry = this.cacheMap.get(this.getCacheKey(category));
      if (entry) return entry;

      const stored = localStorage.getItem(this.getCacheKey(category));
      if (!stored) return null;

      const parsedEntry = JSON.parse(stored) as CacheEntry;
      this.cacheMap.set(this.getCacheKey(category), parsedEntry);
      return parsedEntry;
    },

    isCacheValid(category: string = 'all'): boolean {
      const entry = this.getCache(category);
      if (!entry) return false;
      return Date.now() - entry.timestamp < this.cacheDuration;
    },

    setCategoryCache(categories: string[]) {
      this.categoryCache = {
        categories,
        timestamp: Date.now(),
      };
      localStorage.setItem('categories', JSON.stringify(this.categoryCache));
    },

    getCategoryCache(): CategoryCache | null {
      if (this.categoryCache) return this.categoryCache;

      const stored = localStorage.getItem('categories');
      if (!stored) return null;

      this.categoryCache = JSON.parse(stored);
      return this.categoryCache;
    },

    isCategoryCacheValid(): boolean {
      const cache = this.getCategoryCache();
      if (!cache) return false;
      return Date.now() - cache.timestamp < this.cacheDuration;
    },
  },
});
