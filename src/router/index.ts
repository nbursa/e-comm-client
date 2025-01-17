import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else if (to.hash) {
        return { el: to.hash, behavior: 'smooth' };
      } else {
        return { top: 0, behavior: 'smooth' };
      }
    },
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory('/'),
  });

  Router.beforeEach((to, from, next) => {
    const defaultTitle = 'E-Comm Platform';
    document.title = to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle;
    next();
  });

  return Router;
});

export const CATEGORY_PATH = '/products/categories';
export const PRODUCT_PATH = '/products';
export const CART_PATH = '/cart';
export const CHECKOUT_PATH = '/checkout';
export const ORDER_PATH = '/orders';
export const ORDER_DETAILS_PATH = '/orders/:id';
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const PROFILE_PATH = '/profile';
export const PASSWORD_RESET_PATH = '/password-reset';
export const PASSWORD_RESET_CONFIRM_PATH = '/password-reset-confirm';
export const PASSWORD_CHANGE_PATH = '/password-change';
export const ADDRESS_PATH = '/address';
export const ADDRESS_CREATE_PATH = '/address/create';
export const ADDRESS_UPDATE_PATH = '/address/:id';
export const PAYMENT_PATH = '/payment';
export const PAYMENT_CREATE_PATH = '/payment/create';
export const PAYMENT_UPDATE_PATH = '/payment/:id';
export const REVIEW_PATH = '/review';
export const REVIEW_CREATE_PATH = '/review/create';
export const REVIEW_UPDATE_PATH = '/review/:id';
export const WISHLIST_PATH = '/wishlist';
export const WISHLIST_CREATE_PATH = '/wishlist/create';
export const WISHLIST_UPDATE_PATH = '/wishlist/:id';
export const NOT_FOUND_PATH = '/404';
