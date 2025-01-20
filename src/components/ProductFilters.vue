<template>
  <div class="tw-container !tw-shadow-none tw-mx-0 sm:tw-mx-auto tw-pb-4 md:tw-pb-0 !tw-mt-1">
    <FiltersForm
      :filters="filters"
      :sort-options="sortOptions"
      :sort-order-options="sortOrderOptions"
      @update:filters="updateFilters"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import FiltersForm from './FiltersForm.vue';

const props = defineProps({
  initialFilters: {
    type: Object,
    required: true,
  },
  sortOptions: {
    type: Array,
    required: true,
  },
  sortOrderOptions: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:filters']);

const filters = ref({ ...props.initialFilters });

const emitFilters = () => {
  emit('update:filters', {
    ...filters.value,
    sortBy: filters.value.sortBy.value || filters.value.sortBy,
    sortOrder: filters.value.sortOrder.value || filters.value.sortOrder,
  });
};

const updateFilters = (newFilters: Record<string, unknown>) => {
  filters.value = newFilters;
};

watch(filters, emitFilters, { deep: true });
</script>
