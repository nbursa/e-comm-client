import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as { id: number; quantity: number }[],
  }),
  actions: {
    addToCart(productId: number) {
      const item = this.items.find((i) => i.id === productId);
      if (item) {
        item.quantity++;
      } else {
        this.items.push({ id: productId, quantity: 1 });
      }
    },
    removeFromCart(productId: number) {
      this.items = this.items.filter((i) => i.id !== productId);
    },
  },
});
