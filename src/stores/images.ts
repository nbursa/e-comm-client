import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PreviewImage } from '@/types';

const imageUrlCache = ref(new Map<string, HTMLImageElement>());

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

  const cacheImageUrl = (url: string) => {
    if (!imageUrlCache.value.has(url)) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        imageUrlCache.value.set(url, img);
      };
    }
  };

  const getCachedImageUrl = (url: string) => {
    const cachedImage = imageUrlCache.value.get(url);
    return cachedImage ? cachedImage.src : url;
  };

  return {
    isOpen,
    images,
    openPreview,
    closePreview,
    cacheImageUrl,
    getCachedImageUrl,
  };
});
