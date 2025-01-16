<template>
  <q-dialog v-model="internalDialog" class="confirm-dialog">
    <q-card style="max-width: 430px; width: 95vw; margin: 0 auto">
      <q-card-section>
        <div class="tw-flex tw-flex-col tw-items-start full-width">
          <h6 class="q-my-none">{{ $t('checkout.summary') }}</h6>
          <p class="text-h6 q-mb-md">
            {{ $t('checkout.total') }}: {{ formatPrice(orderDetails.total) }}
          </p>

          <div class="q-mb-md">
            <strong>{{ $t('checkout.shippingDetails') }}:</strong>
            <p class="q-mb-none">{{ orderDetails.firstName }} {{ orderDetails.lastName }}</p>
            <p class="q-mb-none">{{ orderDetails.email }}</p>
            <p class="q-mb-none">{{ orderDetails.address }}</p>
          </div>

          <div class="q-mb-md">
            <strong>{{ $t('checkout.paymentInfo') }}:</strong>
            <p class="q-mb-none">
              {{ $t('checkout.card') }}: **** **** **** {{ orderDetails.cardNumber.slice(-4) }}
            </p>
            <p class="q-mb-none">{{ $t('checkout.expiry') }}: {{ orderDetails.expiry }}</p>
          </div>

          <div class="q-mt-sm full-width">
            <strong>{{ $t('checkout.items') }}:</strong>
            <div
              v-for="item in orderDetails.items"
              :key="item.id"
              class="q-py-xs tw-grid tw-grid-cols-3 tw-gap-1 tw-w-full"
            >
              <div>{{ item.name || item.title }}</div>
              <div class="tw-text-center">{{ item.quantity }}</div>
              <div class="tw-text-right">{{ formatPrice(item.price) }}</div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions
        class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-2 tw-items-center !tw-justify-between"
      >
        <q-btn
          :label="$t('checkout.cancelButton')"
          outline
          class="!tw-w-full sm:!tw-w-40 !tw-py-4 !tw-flex !tw-items-center !tw-justify-center"
          :class="`tw-border-${color}`"
          @click="onCancel"
        />
        <q-btn
          :label="$t('checkout.confirmButton')"
          flat
          :text-color="text"
          class="!tw-w-full sm:!tw-w-40 !tw-m-0 !tw-py-4 !tw-flex !tw-items-center !tw-justify-center"
          :class="`bg-${color}`"
          @click="onConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { OrderDetails } from '@/types';
import { formatPrice } from '@/utils/currency';
import { computed, PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  orderDetails: {
    type: Object as () => OrderDetails,
    required: true,
  },
  color: {
    type: String as PropType<string>,
    required: true,
  },
  text: {
    type: String as PropType<string>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const internalDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const onConfirm = () => {
  internalDialog.value = false;
  emit('confirm');
};

const onCancel = () => {
  internalDialog.value = false;
  emit('cancel');
};
</script>

<style scoped>
.confirm-dialog {
  max-width: 600px;
  width: 95vw;
  margin: 0 auto;
  .q-card.q-card--dark.q-dark {
    box-shadow: none !important;
  }
}
</style>
