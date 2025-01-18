<template>
  <p
    class="tw-text-base tw-font-serif tw-leading-relaxed q-mb-md sm:tw-text-lg"
    :style="{ color: `${textColor}` }"
  >
    {{ description }}
  </p>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const props = defineProps({
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
});

const $q = useQuasar();

const textColor = computed(() => {
  return props.color || ($q.dark.isActive ? 'white' : 'black');
});
</script>
