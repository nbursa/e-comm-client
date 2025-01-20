<template>
  <div
    class="tw-flex tw-flex-col tw-gap-3 tw-mx-auto md:!tw-flex-row tw-rounded md:tw-px-1 md:tw-max-w-screen-2xl"
  >
    <q-input
      v-model="filters.search"
      placeholder="Search products"
      label="Search"
      clearable
      dense
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
        clearable
        dense
        class="tw-w-full md:tw-w-1/4 md:tw-min-w-20 lg:tw-flex-1"
        @input="emitFilters"
      />
      <q-input
        v-model.number="filters.maxPrice"
        type="number"
        label="Max Price"
        placeholder="Max Price"
        clearable
        dense
        class="tw-w-full md:tw-w-1/4 md:tw-min-w-20 lg:tw-flex-1"
        @input="emitFilters"
      />
      <q-select
        v-model="filters.sortBy"
        :options="sortOptions"
        label="Sort By"
        dense
        class="tw-w-full md:tw-w-1/4 md:tw-min-w-20 lg:tw-flex-1"
        @input="emitFilters"
      />
      <q-select
        v-model="filters.sortOrder"
        :options="sortOrderOptions"
        label="Sort Order"
        dense
        class="tw-w-full md:tw-w-1/4 md:tw-min-w-20 lg:tw-flex-1"
        @input="emitFilters"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  filters: {
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

const filters = ref({ ...props.filters });

const emitFilters = () => {
  emit('update:filters', filters.value);
};

watch(filters, emitFilters, { deep: true });
</script>
