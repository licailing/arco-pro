import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/list',
  name: 'list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.list',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'search-table', // The midline path complies with SEO specifications
      name: 'SearchTable',
      component: () => import('@/views/list/search-table/index.vue'),
      meta: {
        locale: 'menu.list.searchTable',
        requiresAuth: true,
        roles: ['*'],
        cache: true,
        hideChildrenInMenu: true,
      },
    },
    {
      path: 'search-table/add',
      name: 'SearchAdd',
      component: () => import('@/views/list/search-table/update.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'search-table/update/:id',
      name: 'SearchUpdate',
      component: () => import('@/views/list/search-table/update.vue'),
      meta: {
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
