<template>
  <p class="tw-text-base tw-font-serif tw-leading-relaxed q-mb-md sm:tw-text-lg" :style="{ color }">
    {{ description }}
  </p>
</template>

<script lang="ts" setup>
defineProps({
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'black',
  },
});
</script>
