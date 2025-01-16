<template>
  <q-page padding class="flex flex-center items-center">
    <div class="text-center">
      <PageTitle :title="$t('home.title')" />
      <PageSubtitle :subtitle="$t('home.subtitle')" />
      <AppButton
        :color="color"
        :text-color="text"
        :label="$t('home.products')"
        class-name="!tw-w-full sm:!tw-w-fit sm:!tw-px-24"
        @click="goToProducts"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import type { QVueGlobals } from 'quasar';
import { computed } from 'vue';
import PageTitle from '@/components/base/PageTitle.vue';
import PageSubtitle from '@/components/base/PageSubtitle.vue';
import { useRouter } from 'vue-router';
import AppButton from '@/components/base/AppButton.vue';

const $q = useQuasar() as QVueGlobals;
const router = useRouter();

const color = computed(() => ($q.dark.isActive ? 'white' : 'black'));
const text = computed(() => ($q.dark.isActive ? 'black' : 'white'));

const goToProducts = () => {
  router.push('/products');
};
</script>
