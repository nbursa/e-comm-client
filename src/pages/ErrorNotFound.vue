<template>
  <q-page padding class="text-center">
    <h1>{{ $t('404.error') }} 404</h1>
    <p>{{ $t('404.notExist') }}</p>
    <q-btn flat to="/" :label="$t('404.goHome')" />
  </q-page>
</template>

<script lang="ts" setup></script>
