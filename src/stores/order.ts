import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IOrderForm } from '@/types';
import { storage } from '@/utils/storage';

export const useOrderStore = defineStore('order', () => {
  const orderForm = ref<IOrderForm>({
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
    },
    payment: {
      method: 'card',
      cardDetails: {
        cardNumber: '',
        expiry: '',
        cvv: '',
      },
    },
  });

  const setShippingForm = (shippingData: IOrderForm['shipping']) => {
    orderForm.value.shipping = shippingData;
    storeOrder();
  };

  const setPaymentForm = (paymentData: IOrderForm['payment']) => {
    orderForm.value.payment = paymentData ?? {
      method: 'card',
      cardDetails: {
        cardNumber: '',
        expiry: '',
        cvv: '',
      },
    };
    storeOrder();
  };

  const loadOrder = () => {
    const storedOrder = storage.get('orderForm');
    if (storedOrder) {
      orderForm.value = storedOrder;
    }
  };

  const storeOrder = () => {
    storage.set('orderForm', orderForm.value, {
      version: '1.0',
    });
  };

  const clearOrderForm = () => {
    orderForm.value = {
      shipping: {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
      },
      payment: {
        method: 'card',
        cardDetails: {
          cardNumber: '',
          expiry: '',
          cvv: '',
        },
      },
    };
    storage.remove('orderForm');
  };

  return {
    orderForm,
    setShippingForm,
    setPaymentForm,
    loadOrder,
    clearOrderForm,
    storeOrder,
  };
});
