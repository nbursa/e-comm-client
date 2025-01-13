<template>
  <q-btn
    dense
    :flat="flat"
    :outline="outline"
    :unelevated="!outline && !flat"
    :label="label"
    :color="outline ? '' : flat ? '' : color"
    :text-color="outline ? '' : flat ? '' : text"
    :border-color="outline ? color : ''"
    :class="[
      'tw-rounded-lg tw-font-medium tw-text-center tw-transition !tw-py-3 tw-px-4',
      'hover:tw-opacity-90 focus:tw-ring focus:tw-ring-offset-2 focus:tw-ring-opacity-50',
      className,
    ]"
    :to="to"
    @click="handleClick"
  />
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { computed, PropType } from 'vue';

const props = defineProps({
  to: {
    type: String as PropType<string | Record<string, unknown>>,
    default: '',
  },
  label: {
    type: String as PropType<string>,
    default: '',
  },
  className: {
    type: String as PropType<string>,
    default: '',
  },
  flat: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  outline: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  action: {
    type: Function as PropType<() => void>,
    default: null,
  },
});

const emit = defineEmits(['click']);

const userStore = useUserStore();

const currentTheme = computed(() => userStore.settings.theme);
const isDark = computed(() => currentTheme.value === 'dark');

const color = computed(() => {
  // if (props.outline) return '';
  return isDark.value ? 'white' : 'black';
  // if (props.outline) {
  //   return isDark.value ? 'white' : 'black';
  // } else {
  //   return isDark.value ? 'black' : 'white';
  // }
});

const text = computed(() => {
  return isDark.value ? 'black' : 'white';
  //   if (props.outline) {
  //   return isDark.value ? 'black' : 'white';
  // } else {
  //   return isDark.value ? 'white' : 'black';
  // }
});

const handleClick = () => {
  if (typeof props.action === 'function') {
    props.action();
  } else {
    emit('click');
  }
};
</script>
