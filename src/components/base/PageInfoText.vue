<template>
  <p class="tw-text-base tw-font-serif tw-text-yellow-500 tw-leading-relaxed q-mb-md sm:tw-text-lg">
    {{ description }}
  </p>
</template>

<script lang="ts" setup>
defineProps<{ description: string }>();
</script>
