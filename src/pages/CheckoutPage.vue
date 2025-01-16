<template>
  <q-page padding class="!tw-pb-16">
    <div class="tw-container tw-max-w-screen-xl tw-mx-auto">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-stepper
            v-model="step"
            vertical
            class="checkout-stepper !tw-bg-transparent full-width"
            color="none"
            :text-color="text"
            header-nav
          >
            <!-- Shipping Step -->
            <q-step
              :name="1"
              :title="$t('checkout.shipping')"
              icon="local_shipping"
              :done="step > 1"
              class="checkout-step"
              :header-nav="true"
            >
              <q-card flat bordered class="!tw-p-0">
                <q-card-section>
                  <q-form ref="formRef" class="row q-col-gutter-md" @submit="validateShipping">
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="form.firstName"
                        :label="$t('checkout.firstName')"
                        :rules="[required]"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="form.lastName"
                        :label="$t('checkout.lastName')"
                        :rules="[required]"
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-model="form.email"
                        :label="$t('checkout.email')"
                        type="email"
                        :rules="[required, emailRules]"
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-model="form.address"
                        :label="$t('checkout.address')"
                        :rules="[required]"
                      />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </q-step>

            <!-- Payment Step -->
            <q-step
              :name="2"
              :title="$t('checkout.payment')"
              icon="payment"
              :done="step > 2"
              :header-nav="true"
            >
              <q-item class="!tw-p-0">
                <q-item-section class="tw-text-sm">
                  <q-radio v-model="paymentMethod" val="card" :label="$t('checkout.cardPayment')" />
                  <q-radio v-model="paymentMethod" val="ips" :disable="!isIpsEnabled">
                    <template #default>
                      <span>
                        {{ $t('checkout.ipsScanQrCode') }}
                        <span v-if="!isIpsEnabled" class="text-positive text-xs">
                          - {{ $t('checkout.ipsInfo') }}</span
                        >
                      </span>
                    </template>
                  </q-radio>
                </q-item-section>
              </q-item>

              <q-card v-if="paymentMethod === 'card'" flat bordered>
                <q-card-section>
                  <q-form
                    ref="paymentRef"
                    class="row q-col-gutter-md"
                    @submit.prevent="validatePayment"
                  >
                    <div class="col-12">
                      <q-input
                        v-model="payment.cardNumber"
                        :label="$t('checkout.cardNumber')"
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
              <div v-if="isIpsEnabled && paymentMethod === 'ips'">
                <div v-if="qrCodeDataUrl" class="q-mt-lg">
                  <q-img
                    :src="qrCodeDataUrl"
                    alt="QR Code for Payment"
                    fit="contain"
                    class="tw-w-48 tw-h-48"
                  />
                </div>
              </div>
            </q-step>
          </q-stepper>
        </div>

        <!-- Order Summary -->
        <div class="col-12 col-md-4">
          <q-item
            class="tw-flex tw-justify-between tw-flex-col tw-gap-4 sm:!tw-pt-4 sm:!tw-pb-3 tw-rounded-md"
            :class="isDark ? 'tw-bg-transparent text-light' : 'bg-light text-dark'"
          >
            <q-item-section class="tw-w-full">
              <div class="tw-text-xl tw-mb-4">{{ $t('checkout.orderSummary') }}</div>
              <q-list dense class="tw-w-full tw-flex tw-flex-col tw-justify-between">
                <q-item v-for="item in cartStore.items" :key="item.id" class="tw-justify-between">
                  <q-item-section>
                    <q-item-label>{{ item.name || item.title }}</q-item-label>
                    <q-item-label caption
                      >{{ $t('checkout.qty') }}: {{ item.quantity }}</q-item-label
                    >
                  </q-item-section>
                  <q-item-section side :class="isDark ? 'text-light' : 'text-dark'">
                    {{ formatPrice(item.price * item.quantity) }}
                  </q-item-section>
                </q-item>
                <q-separator class="q-my-md" />
                <q-item>
                  <q-item-section class="text-subtitle1 text-weight-bold">{{
                    $t('checkout.total')
                  }}</q-item-section>
                  <q-item-section
                    side
                    class="text-subtitle1 text-weight-bold"
                    :class="isDark ? 'text-light' : 'text-dark'"
                    >{{ formatPrice(totalPrice) }}</q-item-section
                  >
                </q-item>
              </q-list>
            </q-item-section>
            <q-card-actions align="center">
              <q-btn
                :color="color"
                :text-color="text"
                :label="step === 2 ? $t('checkout.placeOrder') : $t('checkout.continue')"
                type="submit"
                class="full-width tw-mb-2 !tw-py-4"
                @click="step === 2 ? showOrderConfirmation() : nextStep()"
              />
              <q-btn
                :color="text"
                :text-color="color"
                :label="$t('checkout.cart')"
                class="full-width !tw-py-4"
                @click="goBack()"
              />
            </q-card-actions>
          </q-item>
        </div>
      </div>
    </div>
    <OrderConfirmationDialog
      v-model="showDialog"
      :order-details="orderDetails"
      :color="color"
      :text="text"
      @confirm="handleOrderConfirmation"
      @cancel="handleOrderCancellation"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import { useQuasar } from 'quasar';
import { useCartStore } from '../stores/cart';
import type { QVueGlobals } from 'quasar';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { OrderDetails } from '@/types';
import QRCode from 'qrcode';
import { formatPrice } from '@/utils/currency';
import type { ComponentPublicInstance } from 'vue';
import OrderConfirmationDialog from '@/components/OrderConfirmationDialog.vue';

const scrollToTop = inject('scrollToTop') as () => void;

type QFormInstance = ComponentPublicInstance<{ validate: () => boolean }>;

const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();
const router = useRouter();
const { t } = useI18n();

const step = ref(1);
const paymentMethod = ref('card');
const formRef = ref<QFormInstance | null>(null);
const paymentRef = ref<QFormInstance | null>(null);
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
const qrCodeDataUrl = ref<string | null>(null);
const showDialog = ref(false);

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const isDark = $q.dark.isActive;
const isIpsEnabled = false;
const totalPrice = computed(() =>
  cartStore.items.reduce((total, item) => total + item.price * item.quantity, 0),
);

const email = import.meta.env.VITE_EMAIL_ADMIN || '';
const rn = import.meta.env.VITE_RN || '';

const orderDetails: OrderDetails = {
  id: Math.floor(Math.random() * 1000),
  items: cartStore.items,
  total: totalPrice.value,
  firstName: form.value.firstName,
  lastName: form.value.lastName,
  email: form.value.email,
  address: form.value.address,
  cardNumber: payment.value.cardNumber,
  cvv: payment.value.cvv,
  expiry: payment.value.expiry,
};

const generateQrCode = async () => {
  const paymentPurpose = 'Payment for E-comm-platform';
  const orderNr = Math.floor(Math.random() * 1000);
  const ttl = computed(() => {
    return formatPrice(totalPrice.value, 'RSD')
      .trim()
      .replace(/\s+/, '')
      .replace(',', '')
      .replace('.', ',')
      .replace(/(,\d{2})?$/, (match) => (match ? match : ',00'));
  });

  const qrCodeInfo =
    `K:PR|V:01|C:1|P:${totalPrice.value.toFixed(2)}|S:${paymentPurpose}|N:E-comm-platform|I:${ttl.value}|R:${rn}|RO:00${orderNr}|SF:289`.trim();

  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(qrCodeInfo, { width: 300, margin: 2 });
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};

const required = (val: string) => !!val || 'Field is required';
const emailRules = (val: string) =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Invalid email';

const validateShipping = () => {
  const shippingForm = formRef.value;
  if (shippingForm && shippingForm.validate()) {
    step.value = 2;
  } else {
    $q.notify({
      type: 'negative',
      position: 'top',
      message: 'Please fix errors in the form.',
      timeout: 1000,
    });
  }
};

const validatePayment = () => {
  const paymentForm = paymentRef.value;
  if (paymentForm && paymentForm.validate()) {
    $q.notify({
      type: 'positive',
      position: 'top',
      message: 'Order placed successfully!',
      timeout: 1000,
    });
    step.value = 3;
  } else {
    $q.notify({
      type: 'negative',
      position: 'top',
      message: 'Please fix errors in the form.',
      timeout: 1000,
    });
  }
};

const goBack = () => {
  router.push('/cart');
};

const showOrderConfirmation = () => {
  showDialog.value = true;
};

const handleOrderConfirmation = () => {
  if (process.env.NODE_ENV === 'production') {
    cartStore.clearCart();
    router.push('/thankyou');
  } else {
    emailOrder();
  }
};

const handleOrderCancellation = () => {
  showDialog.value = false;
};

const emailOrder = async () => {
  $q.loading.show();
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        orderDetails,
      }),
    });

    if (!response.ok) throw new Error('Failed to send email');

    cartStore.clearCart();
    router.push('/thankyou');
  } catch {
    $q.notify({
      color: 'negative',
      position: 'top',
      timeout: 1000,
      message: t('checkout.orderFailed'),
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};

const nextStep = () => {
  step.value++;
  scrollToTop();
};

onMounted(() => {
  generateQrCode();
  scrollToTop();
});
</script>

<style lang="scss" scoped>
.checkout-stepper {
  box-shadow: none;
  :deep(.q-stepper__tab--active),
  :deep(.q-stepper__tab--done) {
    color: v-bind(color);

    .q-stepper__title {
      color: v-bind(color);
    }

    .q-stepper__icon {
      color: v-bind(text);
      background: v-bind(color);
    }
  }
}

.order-summary {
  position: sticky;
  top: 20px;
  width: 100%;

  :deep(.q-card__section) {
    padding: 20px;
  }

  :deep(.q-list) {
    width: 100%;
  }

  :deep(.q-item) {
    padding: 12px 0;
  }

  :deep(.q-separator) {
    margin: 12px 0;
  }
}
:deep(.q-stepper__step) {
  .q-stepper__step-inner {
    padding: 1rem 1.15rem;
    .q-form {
      padding-top: 1rem;
    }
    @media screen and (min-width: 600px) {
      padding: 0 24px 32px 60px;
    }
  }
}
</style>
