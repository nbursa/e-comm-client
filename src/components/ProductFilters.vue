<template>
  <div class="tw-container !tw-shadow-none tw-mx-0 md:tw-mx-auto tw-mb-4">
    <div class="tw-flex tw-flex-col tw-gap-3 md:!tw-flex-row tw-rounded tw-mb-4">
      <q-input
        v-model="filters.search"
        placeholder="Search products"
        label="Search"
        class="tw-w-full md:tw-max-w-md tw-mb-3 sm:tw-mr-3"
        @input="emitFilters"
      />
      <div
        class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-3 md:tw-flex md:tw-flex-grow md:tw-flex-row lg:tw-gap-4"
      >
        <q-input
          v-model.number="filters.minPrice"
          type="number"
          label="Min Price"
          placeholder="Min Price"
          class="tw-w-full md:tw-w-1/4 md:tw-min-w-20 lg:tw-flex-1"
          @input="emitFilters"
        />
        <q-input
          v-model.number="filters.maxPrice"
          type="number"
          label="Max Price"
          placeholder="Max Price"
          class="tw-w-full md:tw-w-1/4 md:tw-min-w-20 lg:tw-flex-1"
          @input="emitFilters"
        />
        <q-select
          v-model="filters.sortBy"
          :options="sortOptions"
          label="Sort By"
          class="tw-w-full md:tw-w-1/4 md:tw-min-w-20 lg:tw-flex-1"
          @input="emitFilters"
        />
        <q-select
          v-model="filters.sortOrder"
          :options="sortOrderOptions"
          label="Sort Order"
          class="tw-w-full md:tw-w-1/4 md:tw-min-w-20 lg:tw-flex-1"
          @input="emitFilters"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

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
    sortBy: filters.value.sortBy.value,
    sortOrder: filters.value.sortOrder.value,
  });
};

watch(filters, emitFilters, { deep: true });
</script>
