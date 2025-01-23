<template>
  <q-btn
    :to="to"
    :flat="flat"
    :round="round"
    :dense="dense"
    :outline="outline"
    :unelevated="unelevated"
    :color="computedColor"
    :text-color="outline ? computedColor : computedTextColor"
    :disable="disable"
    :ripple="ripple"
    :push="push"
    :label="label"
    :square="square"
    :fab="fab"
    :icon="icon"
    :icon-right="iconRight"
    :type="type"
    :size="computedSize"
    :class="['qbutton', className]"
    :style="{ fontSize: computedFontSize, padding: computedPadding }"
    @click="handleClick"
  />
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar';

const props = defineProps({
  to: {
    type: String as PropType<string>,
    default: '',
  },
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
  size: {
    type: String as PropType<string>,
    default: '',
  },
  padding: {
    type: String as PropType<string>,
    default: '',
  },
  secondary: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  type: {
    type: String as PropType<string>,
    default: 'button',
  },
  iconRight: {
    type: String as PropType<string>,
    default: '',
  },
});

const emit = defineEmits(['click']);

const $q = useQuasar() as QVueGlobals;

const isDark = computed(() => $q.dark.isActive);

const computedColor = computed(() => {
  if (props.secondary) {
    return props.textColor || (isDark.value ? 'black' : 'white');
  }
  return props.color || (isDark.value ? 'white' : 'black');
});

const computedTextColor = computed(() => {
  if (props.secondary) {
    return props.color || (isDark.value ? 'white' : 'black');
  }
  return props.textColor || (isDark.value ? 'black' : 'white');
});

const computedSize = computed(() => {
  return $q.screen.lt.md ? 'lg' : props.size;
});

const computedFontSize = computed(() => {
  return props.size || '16px';
});

const computedPadding = computed(() => {
  return props.padding || '0';
});

const handleClick = (event: Event) => {
  if (props.type !== 'submit') {
    event.preventDefault();
  }
  event.stopPropagation();
  return typeof props.action === 'function' ? props.action() : emit('click');
};
</script>

<style lang="scss" scoped>
.qbutton {
  transition: all 0.3s ease;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.round {
    width: 2rem;
    height: 2rem;
  }
  &:hover {
    font-size: 16px;
    transform: scale(1.05);
  }
  @media (min-width: 768px) {
  }
}
</style>
