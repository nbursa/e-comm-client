<template>
  <div>
    <q-tabs
      v-model="localSelectedCategory"
      class="q-mb-md gt-sm"
      :active-color="color"
      :active-bg-color="color"
      :text-color="color"
      :inactive-color="color"
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

    <q-select
      v-model="localSelectedCategory"
      :options="['all', ...categories]"
      class="q-my-md lt-md"
      :color="color"
      :text-color="text"
      :label="$t('products.selectCategory')"
      outlined
      :option-label="
        (opt: string) =>
          opt === 'all' ? $t('products.categories.allProducts') : formatCategoryLabel(opt)
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

const props = defineProps({
  selectedCategory: {
    type: String as PropType<string>,
    required: true,
  },
  categories: {
    type: Array as PropType<string[]>,
    required: true,
  },
  color: {
    type: String as PropType<string>,
    required: true,
  },
  text: {
    type: String as PropType<string>,
    required: true,
  },
});

const emit = defineEmits(['update:selectedCategory']);

const localSelectedCategory = computed({
  get: () => props.selectedCategory,
  set: (value: string) => {
    emit('update:selectedCategory', value);
  },
});

const formatCategoryLabel = (category: string) => {
  if (!category) return '';
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
</script>
