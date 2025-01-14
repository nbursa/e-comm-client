<template>
  <div
    :class="[
      'sticky tw-transition-all tw-duration-300',
      isSticky
        ? `tw-fixed tw-left-0 tw-w-screen tw-z-50 tw-px-3 tw-shadow-md !tw-py-0 !tw-text-xs tw-bg-[var(--q-bg-${theme.stickyBgColor})] sticky-top`
        : '',
    ]"
  >
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
import { QVueGlobals } from 'quasar/dist/types/globals';
import { ref, computed, watch, PropType } from 'vue';
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

const emit = defineEmits(['update:selectedCategory']);

const $q = useQuasar() as QVueGlobals;

const isSticky = ref(false);
const stickyContainer = ref<HTMLElement | null>(null);
const localCategory = ref(props.selectedCategory);

const theme = computed(() => ({
  stickyBgColor: $q.dark.isActive ? 'dark' : 'light',
  activeBgColor: $q.dark.isActive ? 'white' : 'white',
  activeTextColor: $q.dark.isActive ? 'dark' : 'black',
  backgroundColor: $q.dark.isActive ? 'white' : 'black',
  textColor: $q.dark.isActive ? 'black' : 'white',
}));

// const stickyTopValue = computed(() => {
//   return $q.screen.gt.xs ? '61px !improtant' : '70px';
// });

watch(
  () => props.scrollOffset,
  (newOffset) => {
    const headerHeight = 70;
    isSticky.value = newOffset > headerHeight;

    if (isSticky.value && stickyContainer.value) {
      stickyContainer.value.style.top = `${headerHeight}px`;
    } else if (stickyContainer.value) {
      stickyContainer.value.style.top = 'initial';
    }
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
  label.q-field {
    margin: 0 !important;
  }
}
.sticky-top {
  top: 53px !important;
}
</style>
