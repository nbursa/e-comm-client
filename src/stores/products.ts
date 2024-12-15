import { defineStore } from 'pinia';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [
      { id: 1, name: 'Product A', price: 50 },
      { id: 2, name: 'Product B', price: 100 },
      { id: 3, name: 'Product C', price: 150 },
    ],
  }),
});
