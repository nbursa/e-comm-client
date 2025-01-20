<template>
  <div class="tw-container !tw-shadow-none tw-mx-0 md:tw-mx-auto !tw-mt-1">
    <FiltersForm
      v-if="!isMobile"
      :filters="filters"
      :sort-options="sortOptions"
      :sort-order-options="sortOrderOptions"
      @update:filters="updateFilters"
    />

    <div v-else class="tw-flex tw-flex-col tw-gap-3 md:!tw-flex-row tw-rounded tw-mb-0">
      <q-select v-model="isOpen" label="Filters" dense class="tw-w-full">
        <div v-if="isOpen">
          <FiltersForm
            :filters="filters"
            :sort-options="sortOptions"
            :sort-order-options="sortOrderOptions"
            @update:filters="updateFilters"
          />
        </div>
      </q-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { computed, ref, watch } from 'vue';
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

const $q = useQuasar();

const filters = ref({ ...props.initialFilters });
const isOpen = ref(false);

const isMobile = computed(() => $q.screen.lt.md);

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
