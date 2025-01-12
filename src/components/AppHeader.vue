<template>
  <q-header :class="[headerClasses, 'tw-overflow-hidden']" :style="headerStyle">
    <div
      class="lights tw-absolute tw-w-full tw-h-full tw-opacity-5"
      :style="{ '--lightsOffset': scrollPosition + 'px' }"
    ></div>
    <q-toolbar>
      <q-toolbar-title
        ><RouterLink to="/" class="tw-text-2xl tw-align-middle tw-font-serif">{{
          $t('main.ecomm')
        }}</RouterLink></q-toolbar-title
      >
      <div class="gt-md tw-text-lg">
        <AppButton
          v-for="item in menuItems"
          :key="item.label"
          :to="item.path"
          :label="item.label"
          :flat="true"
        />
      </div>

      <CartButton
        v-if="!!totalItems"
        :button-size="buttonSize"
        :is-animating="isAnimating"
        :total-items="totalItems"
      />

      <MenuButton
        :button-size="buttonSize"
        class="lt-lg"
        @update:drawer-open="$emit('update:drawerOpen')"
      />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar/dist/types/globals';
import AppButton from './base/AppButton.vue';
import { MenuItem } from '@/types';
import MenuButton from './base/MenuButton.vue';
import CartButton from './base/CartButton.vue';
// import { useUserStore } from '@/stores/user';

defineProps({
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    required: true,
  },
  drawerOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  scrollPosition: {
    type: Number as PropType<number>,
    required: true,
  },
  headerStyle: {
    type: Object as PropType<Record<string, string>>,
    default: () => {},
  },
  headerClasses: {
    type: Array as PropType<string[]>,
    required: true,
  },
});
defineEmits<{
  'update:drawerOpen': [];
}>();

const cartStore = useCartStore();
// const userStore = useUserStore();
const $q = useQuasar() as QVueGlobals;

const isAnimating = ref(false);
// const isDark = computed(() => userStore.settings.theme === 'dark');
// const isScrolledHeader = computed(() => props.scrollPosition > 40);

const totalItems = computed(() => cartStore.totalItems);
const buttonSize = computed(() => {
  if ($q.screen.lt.sm) return 'xl';
  if ($q.screen.lt.md) return 'md';
  return 'md';
});

// const headerStyle = computed(() => {
//   const spread = Math.min(props.scrollPosition / 9, 100);
//   const firstColorStop = spread.toFixed();
//   const secondColorStop = (100 - spread / 2).toFixed();
//   console.log('firstColorStop', firstColorStop, secondColorStop);

//   return {
//     background: `linear-gradient(
//       to right,
//       rgba(26, 32, 44, 0.9) ${firstColorStop}%,
//       rgba(119, 49, 43, 0.9) ${secondColorStop}%
//     )`,
//     color: isDark.value ? 'var(--tw-dark)' : 'inherit',
//   };
// });

// const headerClasses = computed(() => {
//   return [
//     'tw-px-2 md:tw-px-4',
//     isDark.value && isScrolledHeader.value ? 'dark-header' : 'bg-transparent text-light',
//     !isDark.value && isScrolledHeader.value
//       ? 'tw-bg-transparent tw-text-dark'
//       : 'tw-bg-light tw-text-dark',
//   ];
// });

watch(
  () => totalItems.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      isAnimating.value = true;
      setTimeout(() => {
        isAnimating.value = false;
      }, 1000);
    }
  },
);
</script>

<style lang="scss" scoped>
.cart-btn {
  position: relative;

  :deep(.cart-badge) {
    position: absolute;
    top: 5px;
    right: 3px;
    min-width: 18px;
    min-height: 18px;
    aspect-ratio: 1;
    padding: 2px;
    padding-left: 3px;
    border: 2px solid black;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    transform: translate(0, 0);
    line-height: 0;
    text-align: center;
  }
}

:deep(.cart-badge) {
  background-color: white;
  &.blink-animation {
    animation: blink 0.5s ease-in-out;
  }
}

@keyframes blink {
  0%,
  100% {
    transform: scale(1);
    color: white;
    border-color: white;
    background-color: red;
  }
  50% {
    transform: scale(1.5);
    color: white;
    border-color: white;
    background-color: red;
  }
}

:deep(.lang-select) {
  .q-menu.q-position-engine.scroll {
    min-width: 150px !important;
    padding: 8px 0;
    border-radius: 8px;
    transform-origin: top;
    animation: menuIn 0.2s ease-out;

    .q-item {
      min-height: 48px !important;
      padding: 12px 20px !important;
      font-size: 16px !important;
      font-weight: 500;
      transition: all 0.2s ease-in-out;

      &:hover {
        background: rgba(0, 0, 0, 0.05) !important;
        transform: translateX(4px);
      }

      &--active {
        background: rgba(0, 0, 0, 0.08) !important;
        color: var(--q-primary);
      }
    }
  }
}

:deep(.lang-select) {
  .q-field__native {
    display: block;
    padding: 0;
  }

  .q-field__control {
    min-height: 36px;
    padding: 0 8px;
  }

  .q-field__append {
    padding: 0 4px;
  }

  .q-field__marginal {
    height: 36px;
  }

  .q-btn {
    min-height: 36px;
    padding: 0 8px;
  }
}
</style>
