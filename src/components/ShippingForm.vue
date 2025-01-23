<template>
  <q-form
    ref="shippingFormRef"
    class="row q-col-gutter-md shipping-form"
    @submit.prevent="validateShippingForm"
  >
    <div class="col-12 col-sm-6">
      <q-input
        v-model="localShipping.firstName"
        :label="$t('checkout.firstName')"
        reactive-rules
        autofocus
        :rules="[required]"
      />
    </div>
    <div class="col-12 col-sm-6">
      <q-input
        v-model="localShipping.lastName"
        :label="$t('checkout.lastName')"
        reactive-rules
        :rules="[required]"
      />
    </div>
    <div class="col-12">
      <q-input
        v-model="localShipping.email"
        :label="$t('checkout.email')"
        type="email"
        lazy-rules
        :rules="[required, emailRules]"
      />
    </div>
    <div class="col-12">
      <q-input
        v-model="localShipping.address"
        :label="$t('checkout.address')"
        lazy-rules
        :rules="[required]"
      />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { QFormInstance, ShippingDetails } from '@/types';

const props = defineProps({
  shippingForm: {
    type: Object as () => ShippingDetails,
    required: true,
  },
  shippingFormRef: {
    type: Object as () => QFormInstance | null,
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'shipping-valid', value: boolean): void;
  (event: 'update:shipping', value: ShippingDetails): void;
}>();

const { t } = useI18n();

const localShipping = computed({
  get: () => props.shippingForm,
  set: (value: ShippingDetails) => {
    emit('update:shipping', value);
  },
});

const required = (val: string) => !!val || t('errors.validation.required');
const emailRules = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(val) ? true : t('errors.validation.invalidEmail');
};

const validateShippingForm = async () => {
  if (props.shippingFormRef) {
    try {
      const firstNameValid = !!localShipping.value?.firstName;
      const lastNameValid = !!localShipping.value?.lastName;
      const emailValid = emailRules(localShipping.value?.email) === true;
      const addressValid = !!localShipping.value?.address;

      const formValid = firstNameValid && lastNameValid && emailValid && addressValid;

      if (formValid) {
        await props.shippingFormRef.validate();
      } else {
        emit('shipping-valid', false);
        return;
      }

      emit('shipping-valid', formValid);
    } catch {
      emit('shipping-valid', false);
    }
  } else {
    emit('shipping-valid', false);
  }
};
</script>
