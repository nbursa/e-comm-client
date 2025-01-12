<template>
  <q-card
    class="tw-w-full tw-max-w-72 tw-mx-auto sm:tw-mx-none tw-transition tw-duration-200 tw-ease-in-out hover:tw-cursor-pointer hover:tw-scale-105"
    @click="viewProduct(product)"
  >
    <q-img
      :src="imageUrl(product.image)"
      :alt="product.name"
      fit="contain"
      class="sm:tw-h-2/3 tw-w-full tw-max-h-1.5"
    />
    <q-card-section class="tw-flex-grow q-pa-sm !tw-pb-0">
      <div class="text-bold">{{ product.name || product.title }}</div>
      <div class="text-caption">{{ getFirstSentence(product.description) }}</div>
    </q-card-section>

    <q-card-actions class="row justify-between items-center !tw-pt-0">
      <div class="q-mt-sm text-bold price-text">
        <template v-if="product.discount">
          <s class="text-grey">{{ formatPrice(product.price) }}</s>
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
        class="full-width q-mt-md"
        @click.stop="addToCart(product)"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { Product } from '@/types';
import { formatPrice } from '@/utils';

const apiUrl = import.meta.env.VITE_API_URL || '';

defineProps<{
  product: Product;
  color?: string;
  text?: string;
}>();

const emit = defineEmits(['add-to-cart', 'view-product']);

const addToCart = (product: Product) => {
  emit('add-to-cart', product);
};

const viewProduct = (product: Product) => {
  emit('view-product', product);
};

const imageUrl = (imagePath: string) => {
  return process.env.NODE_ENV === 'development' ? `${apiUrl}${imagePath}` : imagePath;
};

const getFirstSentence = (description: string) => {
  const match = description.match(/[^.!?]*[.!?]/);
  return match ? match[0] : description;
};
</script>

<style scoped>
.product-name {
  font-size: 1.2rem;
}

.price-text {
  font-size: 1.2rem;
}
</style>
