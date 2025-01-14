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

export interface ProductsValue {
  all: Product[];
  viewed: Product[];
  categories: string[];
  timestamp: number;
}

interface ProductsStore {
  all: Product[];
  viewed: Product[];
  categories: string[];
  product_categories: Record<string, Product[]>;
  timestamp: number;
  version: string;
  expiration: number;
}

export const useProductStore = defineStore('products', () => {
  const PRODUCTS_EXPIRATION = 5 * 60 * 1000;
  const PRODUCTS_KEY = 'products';
  const MAX_VIEWED = 10;

  const getStore = (): ProductsStore => {
    const defaultStore: ProductsStore = {
      all: [],
      viewed: [],
      categories: [],
      product_categories: {},
      timestamp: Date.now(),
      version: '1.0',
      expiration: PRODUCTS_EXPIRATION,
    };

    const store = storage.get(PRODUCTS_KEY) as ProductsStore;
    return store ? (store as ProductsStore) : defaultStore;
  };

  const setCache = (products: Product[], category: string = 'all'): void => {
    const store = getStore();

    if (category === 'all') {
      store.all = products;
    } else if (category === 'viewed') {
      const newProduct = products[0];
      if (newProduct) {
        store.viewed = [
          newProduct,
          ...(store.viewed || []).filter((p: Product) => p.id !== newProduct.id),
        ].slice(0, MAX_VIEWED);
      }
    } else {
      store.product_categories = store.product_categories || {};
      const categoryKey = category.startsWith('product_')
        ? category
        : `product_${category.toLowerCase()}`;
      store.product_categories[categoryKey] = products;
    }

    store.timestamp = Date.now();
    storage.set(PRODUCTS_KEY, store, {
      expiration: PRODUCTS_EXPIRATION,
      version: '1.0',
    });
  };

  const getCache = (category: string = 'all'): CacheEntry | null => {
    const store = getStore();
    let products: Product[] = [];

    if (category === 'all') {
      products = store.all || [];
    } else if (category === 'viewed') {
      products = store.viewed || [];
    } else if (category.startsWith('product_')) {
      products = store.product_categories?.[category] || [];
    }

    return products.length
      ? {
          products,
          timestamp: store.timestamp,
          category,
        }
      : null;
  };

  const isCacheValid = (category: string = 'all'): boolean => {
    const store = getStore();
    const timestamp = store.timestamp;

    if (category === 'all') {
      return Boolean(store.all?.length) && Date.now() - timestamp < PRODUCTS_EXPIRATION;
    }

    if (category === 'viewed') {
      return Boolean(store.viewed?.length) && Date.now() - timestamp < PRODUCTS_EXPIRATION;
    }

    if (category.startsWith('product_')) {
      const categoryProducts = store.product_categories?.[category];
      return Boolean(categoryProducts?.length) && Date.now() - timestamp < PRODUCTS_EXPIRATION;
    }

    return false;
  };

  const isCategoryCacheValid = () => !storage.isExpired(PRODUCTS_KEY);

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
    setCategoryCache,
    getCategoryCache,
    isCategoryCacheValid,
  };
});
