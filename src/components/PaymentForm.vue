<template>
  <q-form
    ref="paymentFormRef"
    greedy
    class="row q-col-gutter-md payment-form"
    @submit.prevent="validatePaymentForm"
  >
    <div class="col-12">
      <q-input
        v-model="localPayment.cardDetails.cardNumber"
        :label="$t('checkout.cardNumber')"
        mask="#### #### #### ####"
        autofocus
        lazy-rules
        :rules="[required, cardNumberRules]"
      />
    </div>
    <div class="col-6">
      <q-input
        v-model="localPayment.cardDetails.expiry"
        label="MM/YY"
        mask="##/##"
        lazy-rules
        :rules="[required, expiryRules]"
      />
    </div>
    <div class="col-6">
      <q-input
        v-model="localPayment.cardDetails.cvv"
        label="CVV"
        mask="###"
        lazy-rules
        :rules="[required, cvvRules]"
      />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { PaymentDetails, QFormInstance } from '@/types';

const props = defineProps({
  paymentForm: {
    type: Object as () => PaymentDetails,
    required: true,
  },
  paymentFormRef: {
    type: Object as () => QFormInstance | null,
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'payment-valid', value: boolean): void;
  (event: 'update:payment', value: PaymentDetails): void;
}>();

const { t } = useI18n();

const localPayment = computed({
  get: () => {
    return {
      ...props.paymentForm,
      cardDetails: {
        cardNumber: props.paymentForm.cardDetails?.cardNumber || '',
        expiry: props.paymentForm.cardDetails?.expiry || '',
        cvv: props.paymentForm.cardDetails?.cvv || '',
      },
    };
  },
  set: (value: PaymentDetails) => {
    emit('update:payment', value);
  },
});

// const localOrderForm = computed({
//   get: () => {
//     return {
//       ...props.paymentForm,
//       payment: {
//         ...props.paymentForm,
//         cardDetails: {
//           cardNumber: props.paymentForm.cardDetails?.cardNumber || '',
//           expiry: props.paymentForm.cardDetails?.expiry || '',
//           cvv: props.paymentForm.cardDetails?.cvv || '',
//         },
//       },
//     };
//   },
//   set: (value: PaymentDetails) => {
//     emit('update:orderForm', value);
//   },
// });

const validatePaymentForm = () => {
  if (props.paymentFormRef) {
    props.paymentFormRef
      .validate()
      .then((success: boolean) => {
        emit('payment-valid', success);
      })
      .catch(() => {
        emit('payment-valid', false);
      });
  } else {
    emit('payment-valid', false);
  }
};

const required = (val: string) => !!val || t('errors.validation.required');
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
const cvvRules = (val: string) => {
  if (!/^\d{3}$/.test(val)) {
    return t('errors.validation.invalidCVV');
  }
  return true;
};
</script>
