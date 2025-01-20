<template>
  <div :class="['sticky', { 'is-sticky': isSticky }, isSticky && `tw-bg-${theme.stickyBgColor}`]">
    <div
      class="gt-sm tw-w-full tw-flex tw-items-center tw-flex-grow tw-gap-3 tw-py-2 tw-px-1 !tw-max-w-screen-2xl tw-mx-auto !tw-text-[13px]"
    >
      <q-tabs
        v-model="localCategory"
        indicator-color="transparent"
        class="tw-w-full"
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
          class="!tw-text-[13px]"
        />
      </q-tabs>

      <q-btn
        :text-color="theme.activeTextColor"
        :color="theme.activeBgColor"
        icon="tune"
        @click="toggleFilters"
      />
    </div>

    <div class="lt-md tw-flex tw-items-center tw-justify-between tw-px-0">
      <CategorySelect
        v-model:selected-category="localCategory"
        :categories="categories"
        :color="theme.backgroundColor"
        :text="theme.textColor"
        class="tw-w-full tw-mr-3"
      />
      <q-btn
        :text-color="theme.activeTextColor"
        :color="theme.activeBgColor"
        icon="tune"
        class="!tw-py-3"
        @click="toggleFilters"
      />
    </div>

    <ProductFilters
      v-if="showFilters"
      class="tw-mt-3"
      :initial-filters="filters"
      :sort-options="sortOptions"
      :sort-order-options="sortOrderOptions"
      @update:filters="updateFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { QVueGlobals } from 'quasar';
import { ref, computed, watch, PropType, inject } from 'vue';
import CategorySelect from './CategorySelect.vue';
import ProductFilters from './ProductFilters.vue';

const scrollToTop = inject('scrollToTop') as () => void;

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
  filters: {
    type: Object as PropType<Record<string, unknown>>,
    required: true,
  },
  sortOptions: {
    type: Array as PropType<{ label: string; value: string }[]>,
    required: true,
  },
  sortOrderOptions: {
    type: Array as PropType<{ label: string; value: string }[]>,
    required: true,
  },
});

const emit = defineEmits(['update:selectedCategory', 'update:filters']);

const $q = useQuasar() as QVueGlobals;

const isSticky = ref(false);
const localCategory = ref(props.selectedCategory);
const showFilters = ref(false);

const theme = computed(() => ({
  stickyBgColor: $q.dark.isActive ? 'q-dark' : 'q-light-lighter',
  activeBgColor: $q.dark.isActive ? 'white' : 'white',
  activeTextColor: $q.dark.isActive ? 'dark' : 'black',
  backgroundColor: $q.dark.isActive ? 'white' : 'black',
  textColor: $q.dark.isActive ? 'black' : 'white',
}));

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

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

const updateFilters = (newFilters: Record<string, unknown>) => {
  emit('update:filters', newFilters);
};

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

.q-tab__label {
  font-size: 13px;
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
