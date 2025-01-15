import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PreviewImage } from '@/types';

export const useImageStore = defineStore('images', () => {
  const isOpen = ref(false);
  const images = ref<PreviewImage[]>([]);

  const openPreview = (newImages: PreviewImage[]) => {
    images.value = newImages;
    isOpen.value = true;
  };

  const closePreview = () => {
    isOpen.value = false;
    images.value = [];
  };

  return {
    isOpen,
    images,
    openPreview,
    closePreview,
  };
});
