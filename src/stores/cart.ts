import { defineStore } from 'pinia';

type ProductRating = {
  rate: number;
  count: number;
};

export interface Product {
  id: number;
  title: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
  discount?: boolean;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Product[],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce(
        (total, item) => total + (item.discountedPrice || item.price) * item.quantity,
        0,
      ),
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
    updateQuantity(id: number, quantity: number) {
      const item = this.items.find((i) => i.id === id);
      if (item) {
        if (quantity < 1) {
          this.removeItem(id);
        } else {
          item.quantity = quantity;
        }
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
