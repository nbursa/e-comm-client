<template>
  <h1
    class="tw-text-4xl tw-leading-tight tw-font-serif tw-mb-4 sm:tw-leading-normal sm:tw-text-6xl lg:tw-text-5xl"
  >
    {{ title }}
  </h1>
</template>

<script lang="ts" setup>
defineProps<{ title: string }>();
</script>
