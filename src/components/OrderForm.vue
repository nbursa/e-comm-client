<template>
  <q-stepper
    v-model="localStep"
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
          <ShippingForm
            :shipping-form="localOrderForm.shipping"
            :shipping-form-ref="shippingFormRef"
            @shipping-valid="handleShippingValidation"
            @update:shipping="(value) => (localOrderForm.shipping = value)"
          />
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
      :disable="!isShippingValid"
    >
      <q-item v-if="orderForm.payment" class="!tw-p-0">
        <q-item-section class="tw-text-sm">
          <q-radio
            v-model="localOrderForm.payment.method"
            val="card"
            :label="$t('checkout.cardPayment')"
          />
          <q-radio v-model="localOrderForm.payment.method" val="ips" :disable="!isIpsEnabled">
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

      <q-card v-if="orderForm.payment?.method === 'card'" flat bordered>
        <q-card-section>
          <PaymentForm
            :payment-form="localOrderForm.payment"
            :payment-form-ref="paymentFormRef"
            @payment-valid="handlePaymentValidation"
            @update:payment="(value) => (localOrderForm.payment = value)"
          />
        </q-card-section>
      </q-card>
      <div v-if="isIpsEnabled && localOrderForm.payment?.method === 'ips'">
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
</template>

<script lang="ts" setup>
import { IOrderForm, QFormInstance } from '@/types';
import { computed, ref, onMounted } from 'vue';
import ShippingForm from '@/components/ShippingForm.vue';
import PaymentForm from '@/components/PaymentForm.vue';

const props = defineProps({
  step: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  orderForm: {
    type: Object as () => IOrderForm,
    required: true,
  },
  isIpsEnabled: {
    type: Boolean,
    default: false,
  },
  qrCodeDataUrl: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (event: 'update:step', value: number): void;
  (event: 'update:orderForm', value: IOrderForm): void;
  (event: 'shipping-valid', value: boolean): void;
  (event: 'payment-valid', value: boolean): void;
}>();

const isShippingValid = ref(false);
const isPaymentValid = ref(false);
const shippingFormRef = ref<QFormInstance | null>(null);
const paymentFormRef = ref<QFormInstance | null>(null);

const localStep = computed({
  get: () => props.step,
  set: (value: number) => {
    emit('update:step', value);
  },
});

const localOrderForm = computed({
  get: () => props.orderForm,
  set: (value: IOrderForm) => {
    emit('update:orderForm', value);
  },
});

const handleShippingValidation = (valid: boolean) => {
  isShippingValid.value = valid;
  emit('shipping-valid', valid);
};

const handlePaymentValidation = (valid: boolean) => {
  isPaymentValid.value = valid;
  emit('payment-valid', valid);
};

onMounted(() => {
  if (!shippingFormRef.value) {
    shippingFormRef.value = {} as QFormInstance;
  }
  if (!paymentFormRef.value) {
    paymentFormRef.value = {} as QFormInstance;
  }
});
</script>

<style lang="scss">
.q-stepper__label .q-stepper__title {
  font-size: 1.2rem !important;
  font-family: serif;
  font-weight: 600;
}
</style>
