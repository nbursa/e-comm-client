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
          <q-form ref="shippingFormRef" greedy class="row q-col-gutter-md shipping-form">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="localOrderForm.shipping.firstName"
                :label="$t('checkout.firstName')"
                lazy-rules
                :rules="[required]"
                @keydown="validateShippingForm"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="localOrderForm.shipping.lastName"
                :label="$t('checkout.lastName')"
                lazy-rules
                :rules="[required]"
                @keydown="validateShippingForm"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="localOrderForm.shipping.email"
                :label="$t('checkout.email')"
                type="email"
                lazy-rules
                :rules="[required, emailRules]"
                @keydown="validateShippingForm"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="localOrderForm.shipping.address"
                :label="$t('checkout.address')"
                lazy-rules
                :rules="[required]"
                @keydown="validateShippingForm"
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
        <q-card-section v-if="orderForm.payment.cardDetails">
          {{ isPaymentValid }}
          <q-form ref="paymentFormRef" greedy class="row q-col-gutter-md payment-form">
            <div class="col-12">
              <q-input
                v-model="localOrderForm.payment.cardDetails.cardNumber"
                :label="$t('checkout.cardNumber')"
                mask="#### #### #### ####"
                lazy-rules
                :rules="[required, cardNumberRules]"
                @keydown="validatePaymentForm"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="localOrderForm.payment.cardDetails.expiry"
                label="MM/YY"
                mask="##/##"
                lazy-rules
                :rules="[required, expiryRules]"
                @keydown="validatePaymentForm"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="localOrderForm.payment.cardDetails.cvv"
                label="CVV"
                mask="###"
                lazy-rules
                :rules="[required, cvvRules]"
                @keydown="validatePaymentForm"
              />
            </div>
          </q-form>
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
import { IOrderForm } from '@/types';
import { computed, ref } from 'vue';
import { ComponentPublicInstance } from 'vue';
import { useI18n } from 'vue-i18n';

interface QFormInstance extends ComponentPublicInstance {
  validate: () => Promise<boolean>;
}

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
    type: Object,
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

const { t } = useI18n();

const isShippingValid = ref(false);
const isPaymentValid = ref(false);

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

const shippingFormRef = ref<QFormInstance | null>(null);
const paymentFormRef = ref<QFormInstance | null>(null);

const handleShippingValidation = (valid: boolean) => {
  isShippingValid.value = valid;
  emit('shipping-valid', valid);
};

const handlePaymentValidation = (valid: boolean) => {
  isPaymentValid.value = valid;
  emit('payment-valid', valid);
};

const validateShippingForm = () => {
  if (shippingFormRef.value) {
    shippingFormRef.value
      .validate()
      .then((success: boolean) => {
        handleShippingValidation(success);
      })
      .catch(() => {
        handleShippingValidation(false);
      });
  } else {
    handleShippingValidation(false);
  }
};

const validatePaymentForm = () => {
  if (paymentFormRef.value) {
    paymentFormRef.value
      .validate()
      .then((success: boolean) => {
        handlePaymentValidation(success);
      })
      .catch(() => {
        handlePaymentValidation(false);
      });
  } else {
    handlePaymentValidation(false);
  }
};

const required = (val: string) => !!val || t('errors.validation.required');
const emailRules = (val: string) =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || t('errors.validation.invalidEmail');
const cardNumberRules = (val: string) =>
  /^\d{16}$/.test(val.replace(/\s+/g, '')) || t('errors.validation.invalidCardNumber');
const expiryRules = (val: string) => {
  const [month, year] = val.split('/').map(Number);
  if (!month || !year) return t('errors.validation.invalidExpiryDate');
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;
  return (
    (month >= 1 &&
      month <= 12 &&
      year >= currentYear &&
      (year > currentYear || month >= currentMonth)) ||
    t('errors.validation.invalidExpiryDate')
  );
};
const cvvRules = (val: string) => /^\d{3}$/.test(val) || t('errors.validation.invalidCVV');
</script>
