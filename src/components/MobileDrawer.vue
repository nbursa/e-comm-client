<template>
  <q-drawer
    :model-value="drawerOpen"
    side="right"
    :width="drawerWidth"
    :overlay="true"
    behavior="desktop"
    @update:model-value="$emit('update:drawerOpen', $event)"
  >
    <q-scroll-area class="fit">
      <div class="q-pa-sm">
        <q-list class="padding">
          <q-item
            v-for="item in menuItems"
            :key="item.label"
            clickable
            @click="$emit('navigate', item)"
          >
            <q-item-section avatar>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar/dist/types/globals';
import { computed, PropType } from 'vue';

interface MenuItem {
  label: string;
  path: string;
}

defineProps({
  drawerOpen: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  menuItems: {
    type: Array as PropType<{ label: string; path: string }[]>,
    required: true,
  },
});

defineEmits<{
  'update:drawerOpen': [value: boolean];
  navigate: [item: MenuItem];
}>();

const $q = useQuasar() as QVueGlobals;

const drawerWidth = computed<number>(() => {
  return $q.screen.lt.sm ? $q.screen.width : 300;
});
</script>
