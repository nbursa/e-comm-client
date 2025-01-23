<template>
  <q-header class="tw-overflow-hidden tw-px-2 md:tw-px-4" :style="themeStyles">
    <AnimatedLights :scroll-position="scrollOffset" :opacity="50" direction="toLeft" />

    <q-toolbar>
      <q-toolbar-title
        ><RouterLink to="/" class="tw-text-2xl tw-align-middle tw-font-serif tw-font-extrabold">{{
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
        :text-color="color"
        :is-animating="isAnimating"
        :total-items="totalItems"
      />

      <QButton
        v-if="isMobile"
        flat
        dense
        size="sm"
        :label="userLabel"
        :text-color="color"
        icon-right="account_circle"
        class="tw-mx-2 !tw-text-xs"
        @click="goToProfile"
      />

      <div v-if="!isMobile" class="tw-relative">
        <QButton
          flat
          dense
          size="sm"
          :text-color="color"
          icon="account_circle"
          class="tw-mx-2 !tw-text-xs"
          @click="toggleMenu"
        />
        <q-menu v-model="menuOpen" :color="color" class="tw-w-48 tw-rounded-lg tw-shadow-lg">
          <q-list class="!tw-p-2">
            <q-item v-if="isLoggedIn" clickable class="!tw-px-2 !tw-py-0" @click="goToProfile">
              <q-item-section class="tw-font-bold">{{ userLabel }}</q-item-section>
            </q-item>
            <q-separator v-if="isLoggedIn" tw-mx-2 />
            <q-item v-if="isLoggedIn" clickable class="!tw-color-red-400" @click="logout">
              <q-item-section>{{ $t('main.logout') }}</q-item-section>
            </q-item>
            <q-item v-if="!isLoggedIn" clickable @click="goToLogin">
              <q-item-section>{{ $t('main.login') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>

      <MenuButton :button-size="buttonSize" @update:drawer-open="$emit('update:drawerOpen')" />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar';
import AppButton from './base/AppButton.vue';
import { MenuItem } from '@/types';
import MenuButton from './base/MenuButton.vue';
import CartButton from './base/CartButton.vue';
import AnimatedLights from './base/AnimatedLights.vue';
import { useUserStore } from '@/stores/user';
import QButton from './base/QButton.vue';
import { useAuthStore } from '@/stores/auth';
import { LOGIN_PATH, PROFILE_PATH } from '@/constants/routes';
import { useRouter } from 'vue-router';

const props = defineProps({
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    required: true,
  },
  drawerOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  scrollOffset: {
    type: Number as PropType<number>,
    default: 0,
  },
  userName: {
    type: String as PropType<string>,
    default: '',
  },
});

defineEmits<{
  'update:drawerOpen': [];
}>();

const $q = useQuasar() as QVueGlobals;
const cartStore = useCartStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

const isAnimating = ref(false);
const totalItems = computed(() => cartStore.totalItems);
const isLoggedIn = computed(() => !!authStore.token);
const color = computed(() => (darkMode.value ? 'white' : 'black'));
const isMobile = computed(() => $q.screen.lt.sm);
const menuOpen = ref(false);
const buttonSize = computed(() => {
  if ($q.screen.lt.md) return 'lg';
  return 'md';
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const darkMode = computed(() => userStore.settings.theme === 'dark');
const scrolled = computed(() => props.scrollOffset > 40);
const userLabel = computed(() => {
  const label = isLoggedIn.value ? authStore.user?.name : props.userName || 'Guest';
  return !isMobile.value ? label?.split(' ')[0] || '' : '';
});

const themeStyles = computed(() => {
  if (darkMode.value) {
    if (scrolled.value) {
      return {
        background: 'linear-gradient(135deg, #0D1117 0%, #1A202C 50%)',
        color: 'white',
      };
    } else {
      return {
        background: 'transparent',
        color: 'white',
      };
    }
  } else {
    if (scrolled.value) {
      return {
        background: 'linear-gradient(135deg, #FFFFFF 10%, #BFB48F 70%)',
        color: 'black',
      };
    } else {
      return {
        background: 'transparent',
        color: 'black',
      };
    }
  }
});

const goToProfile = () => {
  if (isLoggedIn.value) {
    router.push(PROFILE_PATH);
  } else {
    router.push(LOGIN_PATH);
  }
};

const goToLogin = () => {
  router.push(LOGIN_PATH);
};

const logout = () => {
  authStore.logout();
  router.push(LOGIN_PATH);
};

watch(
  () => totalItems.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      isAnimating.value = true;
      setTimeout(() => (isAnimating.value = false), 1000);
    }
  },
);
</script>

<style lang="scss" scoped>
.light--page .q-layout__section--marginal {
  background-color: var(--q-bg-light);
}

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
    background-color: white;
    &.blink-animation {
      animation: blink 0.5s ease-in-out;
    }
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
