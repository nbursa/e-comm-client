<template>
  <q-page class="tw-p-4">
    <q-card flat class="!tw-bg-transparent tw-max-w-screen-sm tw-mx-auto">
      <q-card-actions class="tw-w-full tw-flex !tw-justify-between tw-items-center tw-mb-8">
        <h5 class="tw-text-3xl tw-font-semibold tw-font-serif">User Profile</h5>
      </q-card-actions>

      <q-card-section>
        <q-item class="tw-w-full tw-flex tw-flex-col tw-justify-between tw-gap-4 !tw-p-0">
          <q-item-section>
            <q-list>
              <q-item-label class="tw-text-base">{{ user?.name }}</q-item-label>
              <q-item-label class="tw-text-xs">{{ user?.email }}</q-item-label>
            </q-list>
          </q-item-section>
          <q-item-section
            class="!tw-w-full !tw-flex sm:!tw-flex-row tw-gap-2 !tw-p-0 tw-items-center !tw-m-0"
          >
            <QButton
              outline
              dense
              label="Update Profile"
              class="!tw-w-full sm:!tw-w-fit"
              @click="updateProfile"
            />
            <QButton
              outline
              dense
              label="Change Password"
              class="!tw-w-full sm:!tw-w-fit"
              @click="changePassword"
            />
            <QButton outline dense label="Logout" class="!tw-w-full sm:!tw-w-fit" @click="logout" />
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-section>
        <h5 class="tw-text-2xl tw-font-semibold tw-font-serif tw-mb-4">Viewed Items</h5>
        <q-list v-if="viewedItems?.length">
          <q-item
            v-for="item in viewedItems"
            :key="item.id"
            clickable
            @click="viewProduct(item.id)"
          >
            <q-item-section avatar>
              <q-img :src="getImageUrl(item.image)" :alt="item.name || item.title" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name || item.title }}</q-item-label>
              <q-item-label caption>{{ formatPrice(item.price) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="tw-text-center tw-text-gray-500">No viewed items</div>
      </q-card-section>

      <!-- Order history -->
      <q-card-section>
        <h5 class="tw-text-2xl tw-font-semibold tw-font-serif tw-mb-4">Order History</h5>
        <q-list v-if="orderHistory?.length">
          <q-item
            v-for="order in orderHistory"
            :key="order.id"
            clickable
            @click="viewOrder(order.id)"
          >
            <q-item-section>
              <q-item-label>Order #{{ order.id }}</q-item-label>
              <q-item-label caption>{{ formatDate(order.date) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{ formatPrice(order.total) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="tw-text-center tw-text-gray-500">No order history</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/products';
import { useRouter } from 'vue-router';
import { formatPrice } from '@/utils/currency';
import QButton from '@/components/base/QButton.vue';
import {
  PRODUCTS_PATH,
  ORDER_DETAILS_PATH,
  PASSWORD_CHANGE_PATH,
  PROFILE_UPDATE_PATH,
  HOME_PATH,
} from '@/constants/routes';
import { useOrderStore } from '@/stores/order';
import { formatDate } from '@/utils/date';
import { useImageStore } from '@/stores/images';

const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');

const authStore = useAuthStore();
const productCache = useProductStore();
const router = useRouter();
const orderStore = useOrderStore();
const imageStore = useImageStore();

const user = computed(() => authStore.user);
const viewedItems = computed(() => productCache.getViewedCache()?.products || []);
const orderHistory = computed(() => orderStore.orderHistory);

const logout = () => {
  try {
    authStore.logout();
    router.push(HOME_PATH);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';

  const fullUrl = `${baseUrl}${imagePath}`;

  const cached = imageStore.getCachedImageUrl(fullUrl);
  if (cached) return cached;

  imageStore.cacheImageUrl(fullUrl);
  return fullUrl;
};

const changePassword = () => {
  router.push(`${PASSWORD_CHANGE_PATH}`);
};

const updateProfile = () => {
  router.push(`${PROFILE_UPDATE_PATH}`);
};

const viewProduct = (id: number) => {
  router.push(`${PRODUCTS_PATH}/${id}`);
};

const viewOrder = (id: number) => {
  router.push(`${ORDER_DETAILS_PATH.replace(':id', id.toString())}`);
};
</script>
