import { useUserStore } from '@/stores/user';

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const userStore = useUserStore();
  const locale = userStore.settings.language || 'en-US';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return dateObj.toLocaleDateString(locale, options || defaultOptions);
};
