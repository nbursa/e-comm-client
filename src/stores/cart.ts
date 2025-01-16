import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Product } from '@/types';
import { storage } from '@/utils/storage';

export const useCartStore = defineStore('cart', () => {
  const CART_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  const loadInitialCart = (): Product[] => {
    const savedCart = storage.get('cart');
    if (!savedCart) return [];

    if (savedCart['0'] && savedCart.timestamp) {
      return [savedCart['0']];
    }

    if (Array.isArray(savedCart) && !storage.isExpired('cart')) {
      return savedCart;
    }

    return [];
  };

  const items = ref<Product[]>(loadInitialCart());

  const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));

  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + item.quantity * item.price, 0),
  );

  const addItem = (item: Product) => {
    const existingItem = items.value.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      items.value.push({ ...item });
    }
    saveCart();
  };

  const updateQuantity = (id: number, quantity: number) => {
    const item = items.value.find((i) => i.id === id);
    if (item) {
      if (quantity < 1) {
        removeItem(id);
      } else {
        item.quantity = quantity;
      }
    }
    saveCart();
  };

  const removeItem = (id: number) => {
    items.value = items.value.filter((item) => item.id !== id);
    saveCart();
  };

  const saveCart = () => {
    storage.set('cart', items.value, {
      expiration: CART_EXPIRATION,
      version: '1.0',
    });
  };

  const clearCart = () => {
    items.value = [];
    saveCart();
  };

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } as const;
});
