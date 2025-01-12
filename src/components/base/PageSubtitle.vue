<template>
  <p
    class="tw-text-base tw-font-medium tw-leading-tight tw-mb-10 sm:tw-leading-relaxed sm:tw-text-lg lg:tw-text-xl"
  >
    {{ subtitle }}
  </p>
</template>

<script lang="ts" setup>
defineProps<{ subtitle: string }>();
</script>
