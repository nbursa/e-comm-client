<template>
  <vue-easy-lightbox
    v-model="isOpen"
    scroll-disabled
    enable-zoom
    esc-disabled
    mask-closable
    :imgs="images"
    :index="currentIndex"
    :visible="isOpen"
    :title-show-count="false"
    :title="title"
    :teleport="teleportTarget"
    :swipe-tolerance="50"
    :loop="false"
    :move-disabled="false"
    class="image-preview"
    @hide="close"
  >
    <template #toolbar>
      <div
        class="!tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-50 tw-bg-black/50 tw-backdrop-blur-sm"
      >
        <div class="tw-flex tw-justify-between tw-items-center tw-pl-3">
          <q-btn
            v-if="showNavButtons"
            flat
            round
            dense
            icon="chevron_left"
            color="white"
            size="lg"
            class="hover:tw-bg-black/50"
            :disable="isFirstImage"
            @click="prev"
          />
          <div class="tw-text-white tw-font-bold">{{ title }}</div>
          <div class="tw-flex tw-gap-2">
            <q-btn
              v-if="showNavButtons"
              flat
              round
              dense
              icon="chevron_right"
              color="white"
              size="lg"
              class="hover:tw-bg-black/50"
              :disable="isLastImage"
              @click="next"
            />
            <q-btn
              flat
              round
              dense
              icon="close"
              color="white"
              class="hover:tw-bg-black/50"
              @click="close"
            />
          </div>
        </div>
      </div>
    </template>
  </vue-easy-lightbox>
</template>

<script setup lang="ts">
import { PropType, ref, computed, onMounted } from 'vue';
import { PreviewImage } from '@/types';
import vueEasyLightbox from 'vue-easy-lightbox';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  images: {
    type: Array as PropType<PreviewImage[]>,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const currentIndex = ref(0);
const teleportTarget = ref<HTMLElement | null>(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const showNavButtons = computed(() => props.images.length > 1);
const isFirstImage = computed(() => currentIndex.value === 0);
const isLastImage = computed(() => currentIndex.value === props.images.length - 1);
const title = computed(() => props.images[currentIndex.value]?.name || '');

const prev = () => {
  if (!isFirstImage.value) {
    currentIndex.value--;
  }
};

const next = () => {
  if (!isLastImage.value) {
    currentIndex.value++;
  }
};

const close = () => {
  emit('update:modelValue', false);
  currentIndex.value = 0;
};

onMounted(() => {
  teleportTarget.value = document.body;
});
</script>

<style lang="scss">
:root .body--dark .vel-modal {
  background: var(--q-dark-rgb) !important;
}

:root .body--light .vel-modal {
  background: var(--q-light-rgb) !important;
}

.vel-modal {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 9999 !important;
}
</style>
