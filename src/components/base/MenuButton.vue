<template>
  <q-btn
    flat
    :size="buttonSize"
    icon="menu"
    class="!tw-p-2 sm:!tw-p-3"
    @click="$emit('update:drawerOpen')"
  />
</template>

<script lang="ts" setup>
defineProps({
  buttonSize: {
    type: String,
    required: true,
  },
});

defineEmits<{
  'update:drawerOpen': [];
}>();
</script>
