import { defineStore } from 'pinia';

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Product[],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce((total, item) => total + item.price * item.quantity, 0),
  },

  actions: {
    addItem(item: Product) {
      const existingItem = this.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.items.push({ ...item });
      }
    },
    removeItem(id: number) {
      this.items = this.items.filter((item) => item.id !== id);
    },
    clearCart() {
      this.items = [];
    },
  },
});
