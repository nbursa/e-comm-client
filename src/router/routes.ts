import type { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';

const loadPage = (page: string) => () => import(`pages/${page}.vue`);

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [{ path: '', component: loadPage('HomePage'), meta: { title: 'Home' } }],
  },

  {
    path: '/cart',
    component: MainLayout,
    children: [{ path: '', component: loadPage('ShoppingCart'), meta: { title: 'Cart' } }],
  },

  {
    path: '/products',
    component: MainLayout,
    children: [
      { path: '', component: loadPage('ProductsPage'), meta: { title: 'Products' } },
      {
        path: ':slug',
        component: loadPage('SingleProductPage'),
        meta: { requiresAuth: false, title: 'Product Details' },
      },
    ],
  },

  {
    path: '/checkout',
    component: MainLayout,
    children: [{ path: '', component: loadPage('CheckoutPage'), meta: { title: 'Checkout' } }],
  },

  {
    path: '/thankyou',
    component: MainLayout,
    children: [{ path: '', component: loadPage('ThankYouPage'), meta: { title: 'Thank You!' } }],
  },

  {
    path: '/settings',
    component: MainLayout,
    children: [{ path: '', component: loadPage('SettingsPage'), meta: { title: 'Settings' } }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: loadPage('ErrorNotFound'),
    meta: { title: 'Not Found' },
  },
];

export default routes;
