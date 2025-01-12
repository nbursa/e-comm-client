<template>
  <q-btn
    v-if="!!totalItems"
    flat
    to="/cart"
    icon="shopping_cart"
    :size="buttonSize"
    class="cart-btn !tw-p-3"
  >
    <q-badge class="cart-badge" :class="{ 'blink-animation': isAnimating }">
      {{ totalItems }}
    </q-badge>
  </q-btn>
</template>

<script lang="ts" setup>
defineProps({
  buttonSize: {
    type: String,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  isAnimating: {
    type: Boolean,
    default: false,
  },
});
</script>
