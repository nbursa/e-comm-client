<template>
  <q-header elevated bordered :class="themeStyle">
    <q-toolbar>
      <q-toolbar-title class="">{{ $t('main.ecomm') }}</q-toolbar-title>
      <div class="gt-md tw-text-lg">
        <q-btn
          v-for="item in menuItems"
          :key="item.label"
          flat
          :to="item.path"
          :label="item.label"
        />
      </div>

      <q-btn flat round dense to="/cart" icon="shopping_cart" size=".8rem" class="cart-btn !tw-p-2">
        <q-badge class="cart-badge" :class="{ 'blink-animation': isAnimating }">
          {{ totalItems }}
        </q-badge>
      </q-btn>

      <q-select
        v-model="currentLanguage"
        :options="languageOptions"
        option-value="value"
        option-label="label"
        dense
        options-dense
        borderless
        emit-value
        map-options
        hide-dropdown-icon
        class="lang-select q-p-none"
        style="min-width: 60px"
        @update:model-value="setLanguage"
      >
        <template #selected>
          <q-btn
            flat
            dense
            :label="displayLanguage"
            class="text-no-wrap !tw-w-full !tw-h-full !tw-p-0"
          />
        </template>
      </q-select>

      <q-btn
        flat
        round
        dense
        icon="menu"
        class="lt-lg !tw-p-2"
        @click="$emit('update:drawerOpen')"
      />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { useQuasar } from 'quasar';
import { MessageLanguages, setLanguage } from '@/boot/i18n';
import { QVueGlobals } from 'quasar/dist/types/globals';

const cartStore = useCartStore();
const userStore = useUserStore();
const $q = useQuasar() as QVueGlobals;

const languageOptions = computed(() => userStore.languageOptions);

const currentLanguage = computed<string>({
  get: () => userStore.settings.language,
  set: (value: string) => {
    userStore.settings.language = value as MessageLanguages;
  },
});

const displayLanguage = computed(() => {
  const lang = currentLanguage.value;
  const option = languageOptions.value.find((opt) => opt.value === lang);
  return option?.value.split('-')[0] || 'EN';
});

const totalItems = computed(() => cartStore.totalItems);

const themeStyle = computed(() =>
  $q.dark.isActive ? 'bg-dark text-light shadow-dark' : 'bg-light text-dark shadow-light',
);

const isAnimating = ref(false);

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

defineProps({
  menuItems: {
    type: Array as PropType<{ label: string; path: string }[]>,
    required: true,
  },
  drawerOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
});

defineEmits<{
  'update:drawerOpen': [];
}>();
</script>

<style lang="scss" scoped>
.cart-btn {
  position: relative;

  :deep(.cart-badge) {
    position: absolute;
    top: 0px;
    right: -3px;
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
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
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
