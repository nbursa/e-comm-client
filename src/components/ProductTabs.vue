<template>
  <div :class="['sticky', { 'is-sticky': isSticky }, isSticky && `tw-bg-${theme.stickyBgColor}`]">
    <q-tabs
      v-model="localCategory"
      indicator-color="transparent"
      class="gt-sm !tw-max-w-screen-xl tw-mx-auto"
      :active-color="theme.activeTextColor"
      :active-bg-color="theme.activeBgColor"
      :text-color="theme.backgroundColor"
      :inactive-color="theme.textColor"
      align="justify"
    >
      <q-tab name="all" :label="$t('products.categories.allProducts')" />
      <q-tab
        v-for="category in categories"
        :key="category"
        :name="category"
        :label="formatCategoryLabel(category)"
      />
    </q-tabs>

    <CategorySelect
      v-model:selected-category="localCategory"
      :categories="categories"
      :color="theme.backgroundColor"
      :text="theme.textColor"
      class="q-my-md lt-md"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar';
import { ref, computed, watch, PropType, inject } from 'vue';
import CategorySelect from './CategorySelect.vue';

const props = defineProps({
  selectedCategory: {
    type: String as PropType<string>,
    required: true,
  },
  scrollOffset: {
    type: Number as PropType<number>,
    default: 0,
  },
  categories: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const scrollToTop = inject('scrollToTop') as () => void;
const emit = defineEmits(['update:selectedCategory']);
const $q = useQuasar() as QVueGlobals;

const isSticky = ref(false);
const localCategory = ref(props.selectedCategory);

const theme = computed(() => ({
  stickyBgColor: $q.dark.isActive ? 'q-dark' : 'q-light-lighter',
  activeBgColor: $q.dark.isActive ? 'white' : 'white',
  activeTextColor: $q.dark.isActive ? 'dark' : 'black',
  backgroundColor: $q.dark.isActive ? 'white' : 'black',
  textColor: $q.dark.isActive ? 'black' : 'white',
}));

watch(
  () => props.scrollOffset,
  (newOffset) => {
    isSticky.value = newOffset > 0;
  },
  { immediate: true },
);

watch(
  () => props.selectedCategory,
  (newCategory) => {
    if (newCategory !== localCategory.value) {
      localCategory.value = newCategory;
    }
  },
);

watch(
  () => localCategory.value,
  (newCategory) => {
    emit('update:selectedCategory', newCategory);
    scrollToTop();
  },
);

const formatCategoryLabel = (category: string) => {
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
</script>

<style lang="scss" scoped>
.sticky {
  position: sticky;
  top: 0;
  transition: all 0.3s ease-in-out;
  transform: translateY(0);

  &.is-sticky {
    position: fixed;
    left: 0;
    width: 100vw;
    z-index: 50;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0;
    padding-bottom: 0;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    transform: translateY(0);
    animation: slideDown 0.3s ease-out;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
