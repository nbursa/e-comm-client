<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>E-Commerce Platform</q-toolbar-title>
        <q-btn flat to="/" label="Home" />
        <q-btn flat to="/products" label="Products" />
        <q-btn flat to="/checkout" label="Checkout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup></script>
