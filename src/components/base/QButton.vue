<template>
  <q-btn
    :flat="flat"
    :round="round"
    :dense="dense"
    :outline="outline"
    :unelevated="unelevated"
    :color="computedColor"
    :text-color="computedTextColor"
    :disable="disable"
    :ripple="ripple"
    :push="push"
    :square="square"
    :fab="fab"
    :class="[
      'qbutton  tw-font-medium tw-text-center tw-transition !tw-py-3 !tw-px-4',
      'hover:!tw-opacity-100 focus:!tw-ring-0',
      className,
    ]"
    @click="handleClick"
  >
    <template v-if="icon">
      <q-icon :name="icon" :color="textColor" size="1rem" class="q-mr-sm" />
    </template>
    {{ label }}
  </q-btn>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar';

const props = defineProps({
  label: {
    type: String as PropType<string>,
    default: '',
  },
  icon: {
    type: String as PropType<string>,
    default: '',
  },
  flat: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  round: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  dense: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  outline: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  disable: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  color: {
    type: String as PropType<string>,
    default: '',
  },
  textColor: {
    type: String as PropType<string>,
    default: '',
  },
  className: {
    type: String as PropType<string>,
    default: '',
  },
  action: {
    type: Function as PropType<() => void>,
    default: null,
  },
  ripple: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  push: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  square: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  fab: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  unelevated: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emit = defineEmits(['click']);

const $q = useQuasar() as QVueGlobals;

const isDark = computed(() => $q.dark.isActive);

const computedColor = computed(() => {
  return props.color || (isDark.value ? 'white' : 'black');
});

const computedTextColor = computed(() => {
  return props.textColor || (isDark.value ? 'black' : 'white');
});

const handleClick = (event: Event) => {
  console.log('Button clicked');
  event.preventDefault();
  event.stopPropagation();
  return typeof props.action === 'function' ? props.action() : emit('click');
};
</script>

<style scoped>
.q-btn {
  transition: all 0.3s ease;
}
</style>
