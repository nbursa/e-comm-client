<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-stepper v-model="step" vertica class="checkout-stepper" color="white" header-nav>
          <!-- Shipping Step -->
          <q-step
            :name="1"
            title="Shipping Details"
            icon="local_shipping"
            :done="step > 1"
            class="checkout-step"
          >
            <q-card flat bordered>
              <q-card-section>
                <q-form class="row q-col-gutter-md" @submit.prevent="validateShipping">
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.firstName" label="First Name" :rules="[required]" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.lastName" label="Last Name" :rules="[required]" />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="form.email"
                      label="Email"
                      type="email"
                      :rules="[required, email]"
                    />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.address" label="Address" :rules="[required]" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-step>

          <!-- Payment Step -->
          <q-step :name="2" title="Payment" icon="payment" :done="step > 2">
            <q-card flat bordered>
              <q-card-section>
                <q-form class="row q-col-gutter-md" @submit.prevent="validatePayment">
                  <div class="col-12">
                    <q-input
                      v-model="payment.cardNumber"
                      label="Card Number"
                      mask="#### #### #### ####"
                      :rules="[required]"
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="payment.expiry"
                      label="MM/YY"
                      mask="##/##"
                      :rules="[required]"
                    />
                  </div>
                  <div class="col-6">
                    <q-input v-model="payment.cvv" label="CVV" mask="###" :rules="[required]" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-step>
        </q-stepper>
      </div>

      <!-- Order Summary -->
      <div class="col-12 col-md-4">
        <q-card class="order-summary">
          <q-card-section>
            <div class="text-h6">Order Summary</div>
            <q-list>
              <q-item v-for="item in cartStore.items" :key="item.id">
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>Qty: {{ item.quantity }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  {{ formatPrice(item.price * item.quantity) }}
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>Total</q-item-section>
                <q-item-section side>{{ formatPrice(totalPrice) }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              :color="color"
              :text-color="text"
              :label="step === 2 ? 'Place Order' : 'Continue'"
              class="full-width"
              @click="step === 2 ? placeOrder() : nextStep()"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useCartStore } from '../stores/cart';
import type { QVueGlobals } from 'quasar/dist/types/globals';

const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();
const step = ref(1);

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
});

const payment = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
});

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));
const totalPrice = computed(() =>
  cartStore.items.reduce((total, item) => total + item.price * item.quantity, 0),
);

const required = (val: string) => !!val || 'Field is required';
const email = (val: string) =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Invalid email';

const validateShipping = () => {
  step.value++;
};

const validatePayment = () => {
  step.value++;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const placeOrder = () => {
  $q.loading.show();
  // Add order placement logic
  setTimeout(() => {
    $q.loading.hide();
    $q.notify({
      color: 'positive',
      message: 'Order placed successfully!',
      icon: 'check',
    });
  }, 2000);
};

const nextStep = () => {
  step.value++;
};
</script>

<style lang="scss" scoped>
.checkout-stepper {
  :deep(.q-stepper__header) {
    color: white;
  }

  :deep(.q-stepper__tab--active),
  :deep(.q-stepper__tab--done) {
    color: white;

    .q-stepper__title {
      color: white;
    }

    .q-stepper__icon {
      color: white;
    }
  }

  :deep(.q-stepper__tab) {
    .q-stepper__title {
      color: white;
    }

    .q-stepper__icon {
      color: white;
    }
  }
}

.order-summary {
  position: sticky;
  top: 20px;
}
</style>
