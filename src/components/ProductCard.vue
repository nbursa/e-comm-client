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
      class="sm:tw-h-2/3 tw-w-full tw-max-h-1.5"
    />
    <div
      v-if="!product.image"
      ref="noImageSection"
      class="tw-p-1.5 tw-flex tw-items-center tw-justify-center tw-min-h-64 tw-w-full tw-max-h-1.5"
    >
      {{ $t('products.noImage') }}
    </div>
    <q-card-section class="q-px-sm !tw-pb-0">
      <div class="text-bold">{{ product.name || product.title }}</div>
      <div class="text-caption">{{ getFirstSentence(product.description) }}</div>
    </q-card-section>

    <q-card-actions class="row justify-between items-center !tw-pt-0">
      <div class="q-mt-sm text-bold price-text">
        <template v-if="product.discount">
          <span class="text-grey">{{ formatPrice(product.price) }}</span>
          <span class="text-positive q-ml-sm">
            {{ formatPrice(product.discountedPrice || product.price) }}
          </span>
        </template>
        <template v-else>
          {{ formatPrice(product.price) }}
        </template>
      </div>
      <q-btn
        :color="color"
        :text-color="text"
        :label="$t('products.addToCart')"
        class="full-width q-mt-md !tw-py-4"
        @click.stop="addToCart(product)"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { Product } from '@/types';
import { formatPrice } from '@/utils/currency';
import { watch, ref } from 'vue';

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
