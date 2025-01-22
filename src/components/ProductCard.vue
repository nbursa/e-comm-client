<template>
  <q-card
    bordered
    class="product tw-w-full tw-max-w-72 tw-mx-auto !tw-bg-primary sm:tw-mx-none tw-transition tw-duration-200 tw-ease-in-out hover:tw-cursor-pointer hover:tw-scale-105 tw-shadow-none"
    @click="viewProduct(product)"
  >
    <q-img
      v-if="product.image"
      ref="imageSection"
      :src="imageUrl(product.image)"
      :alt="product.name"
      fit="cover"
      class="tw-w-full tw-h-64"
    />
    <div
      v-if="!product.image"
      ref="noImageSection"
      class="tw-p-1.5 tw-flex tw-items-center tw-justify-center tw-min-h-64 tw-w-full tw-max-h-1.5"
    >
      {{ $t('products.noImage') }}
    </div>
    <q-card-section class="!tw-p-2 !tw-pb-0">
      <div class="!tw-font-extrabold tw-text-xl">
        {{ product.name || product.title }}
      </div>
      <div class="tw-pl-2 tw-pr-0 tw-py-3">{{ getFirstSentence(product.description) }}</div>
    </q-card-section>

    <q-card-actions class="tw-flex tw-justify-between tw-items-center !tw-pt-0">
      <div class="text-bold tw-text-lg tw-pb-0">
        <template v-if="product.discount">
          <span class="tw-text-gray-500 tw-mr-2 tw-text-base tw-line-through">{{
            formatPrice(product.price)
          }}</span>
          <span class="tw-text-green-600">
            {{ formatPrice(product.discountedPrice || product.price) }}
          </span>
        </template>
        <template v-else>
          {{ formatPrice(product.price) }}
        </template>
      </div>
      <QButton
        ripple
        :color="color"
        :text-color="text"
        :label="$t('products.addToCart')"
        class="!tw-w-full tw-mt-2 !tw-py-4"
        @click="addToCart(product)"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { Product } from '@/types';
import { formatPrice } from '@/utils/currency';
import { watch, ref } from 'vue';
import QButton from './base/QButton.vue';

const apiUrl = import.meta.env.VITE_API_URL || '';

const props = defineProps({
  product: {
    type: Object as () => Product,
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
  text: {
    type: String,
    default: 'white',
  },
});

const emit = defineEmits(['add-to-cart', 'view-product']);

const imageSection = ref<HTMLImageElement | null>(null);
const noImageSection = ref<HTMLDivElement | null>(null);

const addToCart = (product: Product) => {
  emit('add-to-cart', product);
};

const viewProduct = (product: Product) => {
  emit('view-product', product);
};

const imageUrl = (imagePath: string) => {
  return `${apiUrl}${imagePath}`;
};

const adjustNoImageSection = () => {
  if (imageSection.value && noImageSection.value) {
    noImageSection.value.style.height = `${imageSection.value.clientHeight}px`;
  }
};

const getFirstSentence = (description: string) => {
  const match = description.match(/[^.!?]*[.!?]/);
  return match ? match[0] : description;
};

watch(
  () => props.product.image,
  () => {
    adjustNoImageSection();
  },
);
</script>
