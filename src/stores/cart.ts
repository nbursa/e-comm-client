import { Product } from '@/types';
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]') as Product[],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce((total, item) => total + item.quantity * item.price, 0),
  },
  actions: {
    addItem(item: Product) {
      const existingItem = this.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.items.push({ ...item });
      }
      this.saveCart();
    },
    updateQuantity(id: number, quantity: number) {
      const item = this.items.find((i) => i.id === id);
      if (item) {
        if (quantity < 1) {
          this.removeItem(id);
        } else {
          item.quantity = quantity;
        }
      }
      this.saveCart();
    },
    removeItem(id: number) {
      this.items = this.items.filter((item) => item.id !== id);
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    clearCart() {
      this.items = [];
      this.saveCart();
    },
  },
});
