import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const RESULT: AppRouteRecordRaw = {
  path: '/platform',
  name: 'platform',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.platform',
    icon: 'icon-check-circle',
    requiresAuth: true,
    order: 5,
  },
  children: [
    {
      path: 'admin',
      name: 'admin',
      component: () => import('@/views/platform/admin/index'),
      meta: {
        locale: 'menu.platform.admin',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/platform/role/index'),
      meta: {
        locale: 'menu.platform.role',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'premit',
      name: 'premit',
      component: () => import('@/views/platform/premit/index'),
      meta: {
        locale: 'menu.platform.premit',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'customPremit',
      name: 'customPremit',
      component: () => import('@/views/platform/premit/custom.vue'),
      meta: {
        locale: 'menu.platform.customPremit',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default RESULT;
