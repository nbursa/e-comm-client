<template>
  <q-header elevated bordered :class="themeStyle">
    <q-toolbar>
      <q-toolbar-title class="header-title">{{ $t('main.ecomm') }}</q-toolbar-title>
      <div class="gt-md">
        <q-btn
          v-for="item in menuItems"
          :key="item.label"
          flat
          :to="item.path"
          :label="item.label"
        />
      </div>

      <q-btn flat round dense to="/cart" icon="shopping_cart" class="q-mr-sm cart-btn">
        <q-badge floating class="cart-badge" :class="{ 'blink-animation': isAnimating }">
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
        class="lang-select q-mr-sm"
        style="min-width: 80px"
        @update:model-value="setLanguage"
      >
        <template #selected>
          <q-btn flat dense :label="displayLanguage" class="text-no-wrap" />
        </template>
      </q-select>

      <q-btn flat round dense icon="menu" class="lt-lg" @click="$emit('update:drawerOpen')" />
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
    top: 7px;
    right: 7px;
    min-width: 20px;
    min-height: 20px;
    width: fit-content;
    aspect-ratio: 1;
    padding: 4px;
    border: 2px solid black;
    border-radius: 50%;
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
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
