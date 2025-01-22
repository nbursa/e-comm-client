<template>
  <q-page padding class="flex flex-center items-center !tw-p-4">
    <div class="text-center">
      <PageTitle :title="$t('home.title')" />
      <PageSubtitle :subtitle="$t('home.subtitle')" />

      <QButton
        :label="$t('home.products')"
        class-name="!tw-w-full tw-mx-auto !tw-px-4 sm:!tw-w-fit sm:!tw-px-24 !tw-py-2.5"
        @click="goToProducts"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import PageTitle from '@/components/base/PageTitle.vue';
import PageSubtitle from '@/components/base/PageSubtitle.vue';
import { useRouter } from 'vue-router';
import QButton from '@/components/base/QButton.vue';

const router = useRouter();

const goToProducts = () => {
  router.push('/products');
};
</script>
