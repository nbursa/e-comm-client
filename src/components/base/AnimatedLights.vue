<template>
  <div class="tw-absolute !tw-w-screen tw-left-0 tw-right-0 tw-top-0 tw-bottom-0 tw-h-full">
    <div
      class="lights tw-absolute"
      :class="[themeClass, { 'is-dark': isDark }]"
      :style="{
        '--lightsBlur': `${blur}px`,
        '--lightsSpread': `${spread}px`,
        '--lightsDirection': direction === 'toRight' ? '1' : '-1',
        '--lightColor': color,
        transform: transformValue,
        left: direction === 'toRight' ? '0' : 'auto',
        right: direction === 'toLeft' ? '0' : 'auto',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { computed, PropType } from 'vue';

const props = defineProps({
  scrollPosition: {
    type: Number as PropType<number>,
    required: true,
  },
  opacity: {
    type: Number as PropType<number>,
    default: 50,
  },
  blur: {
    type: Number as PropType<number>,
    default: 150,
  },
  spread: {
    type: Number as PropType<number>,
    default: 15,
  },
  color: {
    type: String as PropType<string>,
    default: 'white',
  },

  direction: {
    type: String as PropType<'toRight' | 'toLeft'>,
    required: true,
  },
});

const userStore = useUserStore();

const isDark = computed(() => userStore.settings.theme === 'dark');
const themeClass = computed(() => (isDark.value ? 'lights-dark' : 'lights-light'));
const transformValue = computed(() => {
  const directionMultiplier = props.direction === 'toRight' ? 1 : -1;
  const fullWidth = window.innerWidth - 100;
  const translatedValue = (
    (props.scrollPosition / 100) *
    fullWidth *
    directionMultiplier
  ).toFixed();
  return `translateX(${translatedValue}px)`;
});
</script>

<style lang="scss" scoped>
$base-offset: 50px;
$colors: rgb(255, 0, 0), rgb(0, 255, 0), rgb(0, 0, 255);
$opacity: var(--lightsOpacity, 0.5);
$color: var(--lightColor, white);

.lights {
  position: absolute;
  height: 100vh;
  width: 0;
  top: 0;
  transform: rotate(90deg);
  transition: transform 0.2s ease-out;
  opacity: $opacity;

  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      box-shadow:
        calc(-4 * $base-offset) 0 var(--lightsBlur) var(--lightsSpread) $color,
        calc(-1 * $base-offset) 0 var(--lightsBlur) var(--lightsSpread) $color,
        0 0 var(--lightsBlur) var(--lightsSpread) $color,
        calc($base-offset) 0 var(--lightsBlur) var(--lightsSpread) $color,
        calc(4 * $base-offset) 0 var(--lightsBlur) var(--lightsSpread) $color;
    }

    &.is-dark {
      box-shadow:
        calc(-4 * $base-offset) 0 var(--lightsBlur) var(--lightsSpread) $color,
        calc(-1 * $base-offset) 0 var(--lightsBlur) var(--lightsSpread) $color,
        0 0 var(--lightsBlur) var(--lightsSpread) $color,
        calc($base-offset) 0 var(--lightsBlur) var(--lightsSpread) $color,
        calc(4 * $base-offset) 0 var(--lightsBlur) var(--lightsSpread) $color;
    }
  }
}
</style>
