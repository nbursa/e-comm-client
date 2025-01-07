<template>
  <q-page padding class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
    <h3 class="tw-text-center">Thank you for your purchase!</h3>
    <q-btn color="primary" label="Continue Shopping" @click="() => $router.push('/products')" />
  </q-page>
</template>

<script setup lang="ts"></script>
