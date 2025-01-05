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
        v-model="userStore.language"
        :options="userStore.languageOptions"
        dense
        options-dense
        borderless
        emit-value
        map-options
        class="q-mr-sm"
        style="min-width: 100px"
        @update:model-value="handleLanguageChange"
      />

      <q-btn flat round dense icon="menu" class="lt-lg" @click="$emit('update:drawerOpen')" />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, watch } from 'vue';

import { useCartStore } from '@/stores/cart';
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar/dist/types/globals';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import { MessageLanguages } from '@/boot/i18n';

const cartStore = useCartStore();
const userStore = useUserStore();
const $q = useQuasar() as QVueGlobals;
const { locale } = useI18n();

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

const handleLanguageChange = (value: MessageLanguages) => {
  userStore.language = value;
  locale.value = value;
};

const isAnimating = ref(false);

const totalItems = computed(() => cartStore.totalItems);
const themeStyle = computed(() =>
  $q.dark.isActive ? 'bg-dark text-light shadow-dark' : 'bg-light text-dark shadow-light',
);

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
</style>
